// const checkLoggedUser= () =>{
//   if(sessionStorage.getItem(user))
//   {
//     window.location.href="/client/pages/index.html"
//   }
//   else
//   {

//   }
// }

// checkLoggedUser()

document.getElementById("question").innerHTML = "Dont have an account Register";
var isRegister = false

document.getElementById("question").addEventListener("click",()=>{
  isRegister = !isRegister;
  if(isRegister === false){
    document.getElementById("question").innerHTML = "Dont have an account Register";
    document.getElementById("login-container").style.display="block";
    document.getElementById("register-container").style.display="none"
  }
  else{
    document.getElementById("question").innerHTML = "Already have an account Login";
    document.getElementById("login-container").style.display="none"
    document.getElementById("register-container").style.display="block"
  }
})




const login = async (e) => {
    e.preventDefault();
    const formData = {
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
    };
    try {
      const response = await fetch("http://localhost:9000/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Specify the content type as JSON
        },
        body: JSON.stringify(formData), // Convert formData to JSON
      });
      
      const data = await response.json(); 
      sessionStorage.setItem("user",JSON.stringify(data))
      window.location.href ="/client/pages/index.html"
    } catch (error) {
      console.error("Error:", error);
    }
  };
  

document.getElementById("login-btn").addEventListener("click",login);

const register = async (e) => { // Add the 'e' parameter
  e.preventDefault();
  const formData = {
    username: document.getElementById("reg_username").value,
    email: document.getElementById("reg_email").value,
    password: document.getElementById("reg_password").value,
  }
  try {
    const response = await fetch('http://localhost:9000/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    if (!response.ok) {
      throw new Error('Failed to register user');
    }
    const data = await response.json();
    sessionStorage.setItem("user", JSON.stringify(data))
    window.location.href = "/client/pages/index.html"
  } catch (error) {
    console.error('Error registering user:', error);
    // Handle the error here, such as displaying an error message to the user
  }
}

document.getElementById("register-btn").addEventListener("click", register);
