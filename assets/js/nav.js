(function() {
    var toggle = document.querySelector('.mobile-menu-toggle');
    var nav = document.querySelector('.main-nav');
    var dropdowns = document.querySelectorAll('.has-dropdown');

    if (toggle && nav) {
        toggle.addEventListener('click', function() {
            var expanded = toggle.getAttribute('aria-expanded') === 'true';
            toggle.setAttribute('aria-expanded', !expanded);
            nav.classList.toggle('open');
        });
    }

    // Mobile: toggle dropdowns on click
    dropdowns.forEach(function(item) {
        var link = item.querySelector(':scope > a');
        link.addEventListener('click', function(e) {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                item.classList.toggle('open');
            }
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.site-header')) {
            nav.classList.remove('open');
            toggle.setAttribute('aria-expanded', 'false');
            dropdowns.forEach(function(d) { d.classList.remove('open'); });
        }
    });
})();
