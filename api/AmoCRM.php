<?php

$config = require __DIR__ . '/config.php';

/* =======================
   ЛОГИ
======================= */
function amo_log(array $config, string $msg): void {
  $line = '[' . date('c') . '] ' . $msg . PHP_EOL;
  @file_put_contents($config['logFile'], $line, FILE_APPEND | LOCK_EX);
}

/* =======================
   HTTP (с парсингом заголовков)
======================= */
function amo_http(array $config, string $method, string $url, array $headers = [], ?array $json = null): array {
  $ch = curl_init($url);

  $respHeaders = [];
  curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_CUSTOMREQUEST  => strtoupper($method),
    CURLOPT_HTTPHEADER     => array_merge(['Accept: application/json','Content-Type: application/json'], $headers),
    CURLOPT_CONNECTTIMEOUT => (int)$config['connectTimeoutSec'],
    CURLOPT_TIMEOUT        => (int)$config['timeoutSec'],
    CURLOPT_SSL_VERIFYPEER => 1,
    CURLOPT_SSL_VERIFYHOST => 2,
    CURLOPT_HEADERFUNCTION => function($curl, $headerLine) use (&$respHeaders) {
      $len = strlen($headerLine);
      $parts = explode(':', $headerLine, 2);
      if (count($parts) === 2) {
        $name = strtolower(trim($parts[0]));
        $value = trim($parts[1]);
        $respHeaders[$name] = $value;
      }
      return $len;
    },
  ]);

  if ($json !== null) {
    curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($json, JSON_UNESCAPED_UNICODE));
  }

  $raw  = curl_exec($ch);
  $err  = curl_error($ch);
  $code = (int)curl_getinfo($ch, CURLINFO_HTTP_CODE);
  curl_close($ch);

  $data = is_string($raw) ? json_decode($raw, true) : null;
  return [$code, is_array($data) ? $data : null, is_string($raw) ? $raw : '', $err ?: null, $respHeaders];
}

function amo_base(array $config): string {
  return "https://{$config['subdomain']}.amocrm.ru";
}

/* =======================
   ТОКЕНЫ (устойчиво)
======================= */
function amo_load_tokens(array $config): ?array {
  if (!is_file($config['tokenFile'])) return null;
  $t = json_decode((string)file_get_contents($config['tokenFile']), true);
  return is_array($t) ? $t : null;
}

function amo_save_tokens(array $config, array $t): void {
  if (!isset($t['access_token'], $t['refresh_token'], $t['expires_in'])) {
    throw new RuntimeException('Token payload invalid, not saving.');
  }
  $t['expires_at'] = time() + (int)$t['expires_in'] - (int)$config['tokenLeewaySec'];
  file_put_contents($config['tokenFile'], json_encode($t, JSON_UNESCAPED_UNICODE), LOCK_EX);
}

function amo_exchange_code(array $config): array {
  if (empty($config['authCode'])) throw new RuntimeException('authCode empty (first auth required).');

  [$code, $json, $raw, $err] = amo_http($config, 'POST', amo_base($config) . '/oauth2/access_token', [], [
    'client_id'     => $config['clientId'],
    'client_secret' => $config['clientSecret'],
    'grant_type'    => 'authorization_code',
    'code'          => $config['authCode'],
    'redirect_uri'  => $config['redirectUri'],
  ]);

  if ($code !== 200 || !is_array($json)) {
    throw new RuntimeException("Auth failed HTTP={$code} err={$err} body={$raw}");
  }

  amo_save_tokens($config, $json); // refresh_token ротируется — сохраняем новый
  return $json;
}

function amo_refresh(array $config, string $refreshToken): array {
  [$code, $json, $raw, $err] = amo_http($config, 'POST', amo_base($config) . '/oauth2/access_token', [], [
    'client_id'     => $config['clientId'],
    'client_secret' => $config['clientSecret'],
    'grant_type'    => 'refresh_token',
    'refresh_token' => $refreshToken,
    'redirect_uri'  => $config['redirectUri'],
  ]);

  if ($code !== 200 || !is_array($json)) {
    throw new RuntimeException("Refresh failed HTTP={$code} err={$err} body={$raw}");
  }

  amo_save_tokens($config, $json);
  return $json;
}

function amo_get_access_token(array $config): string {
  $t = amo_load_tokens($config);

  if (!$t) $t = amo_exchange_code($config);

  if (!isset($t['access_token'], $t['refresh_token'])) {
    throw new RuntimeException('tokens.json invalid.');
  }

  $expiresAt = (int)($t['expires_at'] ?? 0);
  if ($expiresAt <= time()) {
    $t = amo_refresh($config, (string)$t['refresh_token']);
  }

  return (string)$t['access_token'];
}

/* =======================
   РЕТРАИ + авто-рефреш при 401
======================= */
function amo_request(array $config, string $method, string $path, ?array $json, bool $auth = true): array {
  $token = null;
  $attempts = (int)$config['retryMax'];

  for ($i = 0; $i <= $attempts; $i++) {
    $headers = [];
    if ($auth) {
      if ($token === null) $token = amo_get_access_token($config);
      $headers[] = 'Authorization: Bearer ' . $token;
    }

    [$code, $data, $raw, $err, $h] = amo_http($config, $method, amo_base($config) . $path, $headers, $json);

    // 401: пробуем обновить токен 1 раз и повторить
    if ($auth && $code === 401 && $i < $attempts) {
      amo_log($config, "401 -> refresh & retry");
      $t = amo_load_tokens($config);
      if (!$t || empty($t['refresh_token'])) throw new RuntimeException('No refresh_token for 401 recovery.');
      amo_refresh($config, (string)$t['refresh_token']);
      $token = null;
      continue;
    }

    // 429/5xx/сетевые: retry с backoff
    $retryable = ($code === 429) || ($code >= 500 && $code <= 599) || ($code === 0 && $err);
    if ($retryable && $i < $attempts) {
      $retryAfter = isset($h['retry-after']) ? (int)$h['retry-after'] : 0;
      $sleepMs = $retryAfter > 0 ? $retryAfter * 1000 : ((int)$config['retryBaseMs'] * (2 ** $i));
      usleep($sleepMs * 1000);
      continue;
    }

    return [$code, $data, $raw];
  }

  return [0, null, ''];
}

/* =======================
   НОРМАЛИЗАЦИЯ ТЕЛЕФОНА
======================= */
function amo_norm_phone(string $phone): string {
  $digits = preg_replace('/\D+/', '', $phone);
  // РФ: если пришло 8XXXXXXXXXX -> 7XXXXXXXXXX
  if (strlen($digits) === 11 && $digits[0] === '8') $digits[0] = '7';
  return $digits;
}

/* =======================
   “ВЕЧНОСТЬ”: поиск/создание контакта и защита от дублей
   - 1) пытаемся найти контакт по телефону (через query)
   - 2) если нашли -> используем id
   - 3) если не нашли -> создаём контакт
======================= */
function amo_find_contact_id_by_phone(array $config, string $phoneDigits): ?int {
  // amoCRM/Kommo контакты: GET /api/v4/contacts?query=...
  [$code, $data, $raw] = amo_request($config, 'GET', '/api/v4/contacts?query=' . urlencode($phoneDigits), null, true);

  if ($code < 200 || $code >= 300 || !is_array($data)) return null;

  $items = $data['_embedded']['contacts'] ?? null;
  if (!is_array($items) || count($items) === 0) return null;

  // берём первый — обычно это то, что нужно для сайта
  $id = $items[0]['id'] ?? null;
  return is_numeric($id) ? (int)$id : null;
}

function amo_create_contact(array $config, string $name, string $phoneRaw): int {
  $payload = [[
    'first_name' => $name,
    'custom_fields_values' => [[
      'field_code' => 'PHONE',
      'values' => [[
        'value'     => $phoneRaw,
        'enum_code' => $config['phoneEnumCode'] ?? 'WORK',
      ]]
    ]]
  ]];

  [$code, $data, $raw] = amo_request($config, 'POST', '/api/v4/contacts', $payload, true);
  if ($code < 200 || $code >= 300 || !is_array($data)) {
    throw new RuntimeException("Create contact failed HTTP={$code} body={$raw}");
  }

  $id = $data['_embedded']['contacts'][0]['id'] ?? null;
  if (!is_numeric($id)) throw new RuntimeException('Create contact: no id in response.');
  return (int)$id;
}

function amo_create_lead(array $config, int $contactId, ?string $leadTitle = null): int {
  $lead = [
    'name'  => $leadTitle ?: ($config['leadName'] ?? 'Заявка с сайта'),
    'price' => 0,
    '_embedded' => [
      'contacts' => [[ 'id' => $contactId ]]
    ],
  ];

  if (!empty($config['pipelineId']))    $lead['pipeline_id'] = (int)$config['pipelineId'];
  if (!empty($config['statusId']))      $lead['status_id'] = (int)$config['statusId'];
  if (!empty($config['responsibleId'])) $lead['responsible_user_id'] = (int)$config['responsibleId'];

  // надёжнее, чем complex, если завтра поменяют нюансы валидации:
  // 1) контакт уже есть
  // 2) создаём лид
  [$code, $data, $raw] = amo_request($config, 'POST', '/api/v4/leads', [$lead], true);

  if ($code < 200 || $code >= 300 || !is_array($data)) {
    throw new RuntimeException("Create lead failed HTTP={$code} body={$raw}");
  }

  $id = $data['_embedded']['leads'][0]['id'] ?? null;
  if (!is_numeric($id)) throw new RuntimeException('Create lead: no id in response.');
  return (int)$id;
}

/* =======================
   ГЛАВНАЯ ФУНКЦИЯ: “имя + телефон” -> контакт (без дублей) -> лид
======================= */
function amo_send_lead(array $config, string $name, string $phone): int {
  $name = trim($name);
  $phone = trim($phone);

  if ($name === '' || $phone === '') throw new InvalidArgumentException('name/phone required');

  $phoneDigits = amo_norm_phone($phone);

  $contactId = amo_find_contact_id_by_phone($config, $phoneDigits);
  if (!$contactId) {
    $contactId = amo_create_contact($config, $name, $phone);
  }

  return amo_create_lead($config, $contactId);
}

/* =======================
   ПРИМЕР ОБРАБОТЧИКА ФОРМЫ (POST: name, phone)
======================= */
if (php_sapi_name() !== 'cli') {
  header('Content-Type: application/json; charset=utf-8');

  $name  = (string)($_POST['name'] ?? '');
  $phone = (string)($_POST['phone'] ?? '');

  try {
    $leadId = amo_send_lead($config, $name, $phone);
    echo json_encode(['ok' => true, 'lead_id' => $leadId], JSON_UNESCAPED_UNICODE);
  } catch (Throwable $e) {
    amo_log($config, $e->getMessage());
    http_response_code(500);
    echo json_encode(['ok' => false], JSON_UNESCAPED_UNICODE);
  }
}
