const menuButton = document.getElementById('menuButton');
const menu = document.getElementById('menu');

menuButton.addEventListener('click', function() {
    menuButton.classList.toggle('open');
    menu.classList.toggle('open');
});

// - - -

const menuUpdateOptions = document.getElementsByName('menu-update-option');

menuUpdateOptions.forEach(menuUpdateOption => {
    menuUpdateOption.checked = (parseInt(menuUpdateOption.value) === LSProvider.get(LSProvider.keys.updateInterval));
    menuUpdateOption.addEventListener('change', e => {
        let updateInterval = parseInt(e.target.value);
        timer.setUpdateInterval(updateInterval);
        LSProvider.set(LSProvider.keys.updateInterval, updateInterval);
    });
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

        case "helipad":
            menuVisibilityOption.checked = LSProvider.get(LSProvider.keys.showingHelipads);
            menuVisibilityOption.addEventListener('change', e => {
                if (e.target.checked) {
                    helipads.show();
                    LSProvider.set(LSProvider.keys.showingHelipads, true);
                } else {
                    helipads.hide();
                    LSProvider.set(LSProvider.keys.showingHelipads, false);
                }
            });
            break;
    
        default:
            break;
    }    
});
