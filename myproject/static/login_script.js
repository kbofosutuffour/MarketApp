function verify() {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let warning = document.getElementById('warning');

    if (username == "marketapp" && password == "h2h") {
        window.location.href = "./home.html";
    } else {
        warning.style.display = "block";
    }
    
// Need to add toggle password visibility functionality
// event listener: 
// on click, toggle attribute between 'text' and 'password'
// toggle eye slash icon
// https://www.csestack.org/hide-show-password-eye-icon-html-javascript/#:~:text=This%20icon%20is%20also%20known%20as%20the%20visibility%20eye%20icon.&text=Use%20the%20below%20CSS%20to,of%20the%20password%20text%20field.

}