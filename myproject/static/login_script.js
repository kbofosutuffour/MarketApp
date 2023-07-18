function verify() {
    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;
    let warning = document.getElementById('warning');

    if (username == "marketapp" && password == "h2h") {
        window.location.href = "./home.html";
    } else {
        warning.style.display = "block";
    }
}