
const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("log-submit");
const loginErrorMsg = document.getElementById("login-error-msg");


loginButton.addEventListener("click", (e)=>{
    e.preventDefault()

    const username = loginForm.username.value;
    const password = loginForm.password.value;

    fetch('http://localhost:3000/', {
        method: "POST",
        headers:{
            "Content-Type": "applicantion/json",
        },
        body:{
            "username": `${username}`,
            "password": `${password}`,
        },

    }).then((res)=> res.json).then((e) => console.error(e))
});

window.onload = function() {
    document.getElementById("test").style.color = "blue";
  }
