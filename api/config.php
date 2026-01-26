<?php
return [
  'subdomain'     => 'YOUR_SUBDOMAIN',     // example (from example.amocrm.ru)
  'clientId'      => 'YOUR_CLIENT_ID',
  'clientSecret'  => 'YOUR_CLIENT_SECRET',
  'redirectUri'   => 'YOUR_REDIRECT_URI',  // должен 1:1 совпадать с интеграцией

  // ТОЛЬКО ДЛЯ ПЕРВОГО ПОЛУЧЕНИЯ tokens.json. Потом можно очистить.
  'authCode'      => 'YOUR_ONE_TIME_CODE',

  // хранить НЕ в public
  'tokenFile'     => __DIR__ . '/tokens.json',
  'logFile'       => __DIR__ . '/amocrm.log',

  // значения по умолчанию
  'leadName'      => 'Заявка с сайта',
  'phoneEnumCode' => 'WORK', // WORK / WORKDD / MOB / HOME / OTHER

  // опционально (если надо сразу в конкретную воронку/этап/ответственного)
  'pipelineId'    => 0,
  'statusId'      => 0,
  'responsibleId' => 0,

  // “вечность”: поведение
  'timeoutSec'    => 20,
  'connectTimeoutSec' => 10,
  'retryMax'      => 3,     // ретраи на 429/5xx/сеть
  'retryBaseMs'   => 250,   // базовый бэкофф
  'tokenLeewaySec'=> 120,   // обновлять заранее
];
