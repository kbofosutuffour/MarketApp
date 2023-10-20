
function togglePassword() {
    //switches between visible and hidden password

    let input = document.getElementById("password");
    let oldState = input.getAttribute("type");
    let newState = (oldState == "password") ? "text" : "password";
    input.setAttribute("type", newState);
}