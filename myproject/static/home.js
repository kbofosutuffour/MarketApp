//Drop-down edit options for each post
function edit_post(event) {
    let editButton = event.target.parentElement.parentElement.parentElement;
    console.log(editButton)
    if (editButton.children[2].style.visibility == 'visible') {
        editButton.children[2].style.visibility = 'hidden';
    } else {
        editButton.children[2].style.visibility = 'visible';
    }
}

//animation when user clicks on search bar
function moveSearchBar() {
    var search_text = document.getElementById('search-text');

    document.getElementById('cancel').style.visibility = 'visible';
    document.getElementById('text').style.visibility = 'visible';
    document.getElementById('search-text').style.visibility = 'visible';


    search_text.style.animation = 'moveleft 0.75s';
    search_text.style.animationFillMode = 'forwards';
}

//function for when user clicks on cancel
function cancel() {
    document.getElementById('cancel').style.visibility = 'hidden';
    document.getElementById('text').style.visibility = 'hidden';
    document.getElementById('search-text').style.animation = '';
    document.getElementById('search-text').style.visibility = 'hidden';
    document.getElementById('search-text').style.animationFillMode = 'backwards';


}

//styling for the cancel button
function cancel_on_or_off(mouse_on_button) {
    document.getElementById('cancel').style.color = mouse_on_button? "red": "gray";
   
}

//Creates error message 
function guest_post_error() {
    var message = document.createElement('h5');
    message.classList.add("message");
    message.innerHTML = "Please login or create an account to make a new post.";
    document.body.appendChild(message);
    console.log(message);
}
