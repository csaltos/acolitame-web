
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

function setSession(){
    // console.log("Guardando Token");
    localStorage.setItem('token',getCookie('token'));
    window.location.href = "/";
}


function logOut(){
  console.log(document.cookie);
  document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  console.log(document.cookie);
  localStorage.removeItem('token');
   window.location.href = "/";
}

function setMultiple(){
  localStorage.setItem('token',getCookie('token'));
  // setSession();
  initImageRead();
}