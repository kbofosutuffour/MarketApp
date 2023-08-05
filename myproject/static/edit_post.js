
function cancel_on_or_off(mouse_on_button) {
    document.getElementById('cancel').style.color = mouse_on_button? "light-red": "gray";
}

function delete_on_or_off(mouse_on_button) {
    document.getElementById('delete').style.backgroundColor = mouse_on_button? "red": "rgba(255, 255, 255, 0.274)";
}

function prompt(on) {
    var section = document.getElementById('section');
    var p = document.getElementById('prompt');
    if (on) {
        section.style.opacity = '15%';
        p.style.display = 'inline';
    } else {
        section.style.opacity = '100%';
        p.style.display = 'none';

    }
}
