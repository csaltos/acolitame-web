console.log("Testing");

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

function setSession(){
    console.log("Guardando Token");
    localStorage.setItem('token',getCookie('token'));
    window.location.href = "/";
}