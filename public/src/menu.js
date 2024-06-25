const menuButton = document.getElementById('menuButton');
const menu = document.getElementById('menu');

const menuVisibilityOptions = document.getElementsByName('menu-visibility-option');


const handleBaseVisibility = (e) => {
    if (e.target.checked) {
        map.showBases();
    } else {
        map.hideBases();
    }
}

const handleRouteVisibility = (e) => {
    if (e.target.checked) {
        map.showRoutes();
    } else {
        map.hideRoutes();
    }
}


menuButton.addEventListener('click', function() {
    menuButton.classList.toggle('open');
    menu.classList.toggle('open');
});

menuVisibilityOptions.forEach(menuVisibilityOption => {
    switch (menuVisibilityOption.value) {

        case "base":
            menuVisibilityOption.addEventListener('change', e => handleBaseVisibility(e));
            break;

        case "route":
            menuVisibilityOption.addEventListener('change', e => handleRouteVisibility(e));
            break;
    
        default:
            break;
    }    
});