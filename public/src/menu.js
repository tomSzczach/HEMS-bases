const menuButton = document.getElementById('menuButton');
const menu = document.getElementById('menu');

menuButton.addEventListener('click', function() {
    menuButton.classList.toggle('open');
    menu.classList.toggle('open');
});

// - - -

const menuVisibilityOptions = document.getElementsByName('menu-visibility-option');

menuVisibilityOptions.forEach(menuVisibilityOption => {
    switch (menuVisibilityOption.value) {

        case "base":
            menuVisibilityOption.checked = LSProvider.get(LSProvider.keys.showingBases);
            menuVisibilityOption.addEventListener('change', e => {
                if (e.target.checked) {
                    map.showBases();
                    LSProvider.set(LSProvider.keys.showingBases, true);
                } else {
                    map.hideBases();
                    LSProvider.set(LSProvider.keys.showingBases, false);
                }
            });
            break;

        case "route":
            menuVisibilityOption.checked = LSProvider.get(LSProvider.keys.showingRoutes);
            menuVisibilityOption.addEventListener('change', e => {
                if (e.target.checked) {
                    map.showRoutes();
                    LSProvider.set(LSProvider.keys.showingRoutes, true);
                } else {
                    map.hideRoutes();
                    LSProvider.set(LSProvider.keys.showingRoutes, false);
                }
            });
            break;
    
        default:
            break;
    }    
});

// - - -



