function show_left(mouse_on_button) {
    let left = document.getElementById('left-arrow');
    left.style.opacity = mouse_on_button? "50%": "0%";
}


function show_right(mouse_on_button) {
    let right = document.getElementById('right-arrow');
    right.style.opacity = mouse_on_button? "50%": "0%";

}

function move_left() {
    let image_list = document.getElementById('images').children;

    for (let i = 0; i < image_list.length; i++) {
        if (image_list[i].style.display == "inline") {
            image_list[i].style.display = "none";

        if (i == 0) {
            image_list[image_list.length - 1].style.display = "inline";
        } else {
            image_list[(i-1) % image_list.length].style.display = "inline";
        }
        break;
        }
    }
}

function move_right() {
    let image_list = document.getElementById('images').children;

    for (let i = 0; i < image_list.length; i++) {
        if (image_list[i].style.display == "inline") {
            image_list[i].style.display = "none";
        image_list[(i+1) % image_list.length].style.display = "inline";
        break;
        }
    }
}