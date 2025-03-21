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
                    LSProvider.set(LSProvider.keys.showingBases, true);
                    bases.show();
                } else {
                    bases.hide();
                    LSProvider.set(LSProvider.keys.showingBases, false);
                }
            });
            break;

        case "mission":
            menuVisibilityOption.checked = LSProvider.get(LSProvider.keys.showingMissions);
            menuVisibilityOption.addEventListener('change', e => {
                if (e.target.checked) {
                    LSProvider.set(LSProvider.keys.showingMissions, true);
                    missions.show();
                } else {
                    missions.hide();
                    LSProvider.set(LSProvider.keys.showingMissions, false);
                }
            });
            break;

        case "helipad":
            menuVisibilityOption.checked = LSProvider.get(LSProvider.keys.showingHelipads);
            menuVisibilityOption.addEventListener('change', e => {
                if (e.target.checked) {
                    LSProvider.set(LSProvider.keys.showingHelipads, true);
                    helipads.show();
                } else {
                    helipads.hide();
                    LSProvider.set(LSProvider.keys.showingHelipads, false);
                }
            });
            break;

        case "ctr":
            menuVisibilityOption.checked = LSProvider.get(LSProvider.keys.showingCTRs);
            menuVisibilityOption.addEventListener('change', e => {
                if (e.target.checked) {
                    LSProvider.set(LSProvider.keys.showingCTRs, true);
                    controlZones.show();
                } else {
                    controlZones.hide();
                    LSProvider.set(LSProvider.keys.showingCTRs, false);
                }
            });
            break;

        case "voivodeship":
            menuVisibilityOption.checked = LSProvider.get(LSProvider.keys.showingVoivodeships);
            menuVisibilityOption.addEventListener('change', e => {
                if (e.target.checked) {
                    LSProvider.set(LSProvider.keys.showingVoivodeships, true);
                    voivodeships.show();
                } else {
                    voivodeships.hide();
                    LSProvider.set(LSProvider.keys.showingVoivodeships, false);
                }
            });
            break;

        case "weatherRadar":
            menuVisibilityOption.checked = LSProvider.get(LSProvider.keys.showingWeatherRadar);
            menuVisibilityOption.addEventListener('change', e => {
                if (e.target.checked) {
                    LSProvider.set(LSProvider.keys.showingWeatherRadar, true);
                    weatherRadar.show();
                } else {
                    weatherRadar.hide();
                    LSProvider.set(LSProvider.keys.showingWeatherRadar, false);
                }
            });
            break;
    
        default:
            break;
    }    
});
