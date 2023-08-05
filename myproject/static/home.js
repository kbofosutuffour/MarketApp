
// function edit_post() {

//     let editButtons = document.getElementsByClassName('edit-post');
//     for (let i = 0; i < editButtons.length; i++) {

//         if (editButtons[i].children[1].style.visibility == 'visible') {
//             editButtons[i].children[1].style.visibility = 'hidden';
//         } else {
//             editButtons[i].children[1].style.visibility = 'visible';
//         }
        
//     }
// }

function leave_post() {
    
    editButton = document.getElementsByClassName('edit-post')
    for (var i = 0; i <= editButton.size(); i++) {
        drop_down = editButton.children[i];
        drop_down.setAttribute('style', 'display: none');
    }
}

function createID() {
    let post_list = document.getElementsByClassName('post');
    target = post_list[len(post_list)-1];
}


function moveSearchBar() {
    let search = document.getElementById('search');
    let cancel = document.getElementById('cancel');
    let text = document.getElementById('text');

    cancel.style.visibility = 'visible';
    text.style.visibility = 'visible';

    search.style.animation = 'mymove1 1s';
    search.style.right = '100px';
}

function cancel() {
    let search = document.getElementById('search');
    let cancel = document.getElementById('cancel');
    let text = document.getElementById('text');

    cancel.style.visibility = 'hidden';
    text.style.visibility = 'hidden';

}

function cancel_on_or_off(mouse_on_button) {
    document.getElementById('cancel').style.color = mouse_on_button? "red": "gray";
   
}
