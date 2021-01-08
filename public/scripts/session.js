// const { urlencoded } = require("body-parser");

console.log("Testing");

console.log(window.location.href);

const urlParams = new URLSearchParams(window.location.href);

console.log(urlParams);