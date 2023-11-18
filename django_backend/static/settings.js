function toggle(event) {
    var choice = event.target.parentElement.style.float;
    console.log(event.target.parentElement.style.float);
    event.target.parentElement.style.float = choice == "left" ? "right" : "left";
}

function switchToChangePassword() {
    document.getElementById('main-screen').style.display = "none";
    document.getElementById('main-screen').style.display = "none";
    document.getElementById('change-password').style.display = "block";

}

function switchToChangeProfilePicture() {
    document.getElementById('main-screen').style.display = "none";
    document.getElementById('change-password').style.display = "none";
    document.getElementById('change-profile-picture').style.display = "block";

}

function switchToAccountSettings() {
    document.getElementById('change-password').style.display = "none";
    document.getElementById('change-profile-picture').style.display = "none";
    document.getElementById('main-screen').style.display = "block";
}