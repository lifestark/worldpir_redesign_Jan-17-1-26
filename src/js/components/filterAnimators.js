// Filter functionality - radio button behavior
function initFilters() {
    const filterButtons = document.querySelectorAll('.filter-btn, .filter-option');
    const animatorCards = document.querySelectorAll('.animator-card');

    if (filterButtons.length === 0 || animatorCards.length === 0) return;

    filterButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            e.preventDefault();

            // Remove active class from ALL buttons
            filterButtons.forEach(btn => {
                btn.classList.remove('filter-btn--active');
            });

            // Add active class to clicked button
            this.classList.add('filter-btn--active');

            // Filter cards
            filterCards();
        });
    });

    function filterCards() {
        const activeButton = document.querySelector('.filter-btn--active');

        if (!activeButton || activeButton.getAttribute('data-filter') === 'all') {
            animatorCards.forEach(card => card.style.display = 'block');
            return;
        }

        const filterValue = activeButton.getAttribute('data-filter');
        const filterGroup = activeButton.closest('.filter-group');
        const filterType = filterGroup ? filterGroup.getAttribute('data-type') : null;

        animatorCards.forEach(card => {
            let matches = false;
            if (filterType) {
                const cardValue = card.getAttribute(`data-${filterType}`);
                matches = (cardValue === filterValue);
            } else {
                matches = (card.getAttribute('data-category') === filterValue);
            }
            card.style.display = matches ? 'block' : 'none';
        });
    }
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', () => {
    initFilters();
});
