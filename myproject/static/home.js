
function edit_post() {
    // let editButtons = document.getElementById('edit-post')
    // editButtons.style.backgroundColor = 'red'

    let editButtons = document.getElementsByClassName('edit-post');
    for (let i = 0; i < editButtons.length; i++) {
        console.log(editButtons[i].children[2].style.visibility);
        console.log('test')
        if (editButtons[i].children[1].style.visibility == 'visible') {
            editButtons[i].children[1].style.visibility = 'hidden';
        } else {
            editButtons[i].children[1].style.visibility = 'visible';
        }
        
    }
}
// function edit_post() {
//     let editButtons = document.getElementsByClassName('edit-post');
//     for (let i = 0; i < editButtons.length; i++) {
//         console.log(editButtons[i].children[1]);
//         addEventListener('click', function(event){
//             if (editButtons[i].children[2].style.visibility="hidden") {
//                 editButtons[i].children[2].style.visibility="visible";
//             } else {
//                 editButtons[i].children[2].style.visibility="hidden"
//             }

//         });
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


