const bases = new Bases();
const map = new Map();


const menuVisibilityOptions = document.getElementsByName('menu-visibility-option');


const handleVisibilityOptionsChange = (e) => {
    if (e.target.checked)
    {
        map.showBases();
    }
    else
    {
        map.hideBases();
    }
}


menuVisibilityOptions.forEach(menuVisibilityOption => {
    switch (menuVisibilityOption.value) {

        case "base":
            menuVisibilityOption.addEventListener('change', e => handleVisibilityOptionsChange(e));
            break;
    
        default:
            break;
    }    
});

