
document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.cuisine-filter');
    const storeCards = document.querySelectorAll('.store-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const cuisine = this.getAttribute('data-cuisine');

            storeCards.forEach(card => {
                if (cuisine === 'all' || card.getAttribute('data-cuisine') === cuisine) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
});