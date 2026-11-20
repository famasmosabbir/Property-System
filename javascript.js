
document.getElementById("loginForm").addEventListener("submit", function(event) {

    event.preventDefault();

    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;

    if (email === "" || password === "") {

        document.getElementById("message").innerHTML =
        "Please enter email and password.";

    } else {

        document.getElementById("message").innerHTML =
        "Login Successful!";

        setTimeout(function() {
            window.location.href = "dashboard.html";
        }, 1000);

    }

});