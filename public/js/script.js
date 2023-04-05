const loginForm = document.getElementById("login-form");
const loginUsername = document.getElementById("login-username");
const loginPassword = document.getElementById("login-password");
const loginButton = document.getElementById("login-submit");
const loginErrorMsg = document.getElementById("login-error-msg");

let button = loginButton.addEventListener("click", (e) => {

  e.preventDefault();

    fetch('./login', {
        method: "POST",
        headers: {
            Accept: "application/json, text/plain, */*",
                "Content-Type": "application/json",
        },
        body: JSON.stringify({
            username: loginUsername.value,
            password: loginPassword.value,
        }),
    })
    .then((response) => response.json())
    .then((data) => {

      console.log(data);

      if (data.error && !data.username && !data.password) {

        alert("Invalid Username or Password"); 

      } else if (data.error && !data.password) {

        alert("Invalid Password"); 

      } else  {

        location.href = './';

      }

    })
    .catch((err) => {

      console.error(err);

    });

});