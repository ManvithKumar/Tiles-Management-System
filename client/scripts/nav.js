const logout = () =>{
    sessionStorage.removeItem("user");
    window.location.href ="/client/pages/login.html";
}

