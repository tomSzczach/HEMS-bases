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

// const handleStatusVisibility = (e) => {
//     if (e.target.checked) {
//         map.showStatusDescription();
//     } else {
//         map.hideStatusDescription();
//     }
// }


menuButton.addEventListener('click', function() {
    menuButton.classList.toggle('open');
    menu.classList.toggle('open');
});

menuVisibilityOptions.forEach(menuVisibilityOption => {
    switch (menuVisibilityOption.value) {

        case "base":
            menuVisibilityOption.addEventListener('change', e => handleBaseVisibility(e));
            break;

        // case "status":
        //     menuVisibilityOption.addEventListener('change', e => handleStatusVisibility(e));
        //     break;
    
        default:
            break;
    }    
});