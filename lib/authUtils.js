const crypto = require('crypto');
const jsonwebtoken = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');

const pathToKey = path.join(__dirname, '..', 'privateKey.pem');
const PRIV_KEY = fs.readFileSync(pathToKey, 'utf8');

/**
 * -------------- HELPER FUNCTIONS ----------------
 */

/**
 * 
 * @param {*} password - The plain text password
 * @param {*} hash - The hash stored in the database
 * @param {*} salt - The salt stored in the database
 * 
 * This function uses the crypto library to decrypt the hash using the salt and then compares
 * the decrypted hash/salt with the password that the user provided at login
 */
function validPassword(password, hash, salt) {
    var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    return hash === hashVerify;
}

/**
 * 
 * @param {*} password - The password string that the user inputs to the password field in the register form
 * 
 * This function takes a plain text password and creates a salt and hash out of it.  Instead of storing the plaintext
 * password in the database, the salt and hash are stored for security
 * 
 * ALTERNATIVE: It would also be acceptable to just use a hashing algorithm to make a hash of the plain text password.
 * You would then store the hashed password in the database and then re-hash it to verify later (similar to what we do here)
 */
function genPassword(password) {
    var salt = crypto.randomBytes(32).toString('hex');
    var genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    
    return {
      salt: salt,
      hash: genHash
    };
}


/**
 * @param {*} user - The user object.  We need this to set the JWT `sub` payload property
 */
function issueJWT(user) {
  const id = user.id;
  const name = user.name;

  const expiresIn = '1d';

  const payload = {
    sub: id,
    name: name,
    iat: Date.now()
  };

  const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn: expiresIn, algorithm: 'RS256' });

  return {
    token: "Bearer " + signedToken,
    expires: expiresIn
  }
}


const externalLog = (req, res) => { //Here the token is issued when the login is made with google/facebook 
    console.log("Redirect External")
    console.log(req.user);

    const token =  issueJWT({
        "id": req.user.id,
        "name": req.user.displayName,
    });
    res.status(200).json({succes: true , profile: req.user ,token: token.token , expiresIn: token.expires});
}



function sendNewUser(profile) { //Profile -> Objeto con informacion de usuario recuperada de cuenta de google o facebook.
    var data = {};
    data.clave = "";
    data.correo = profile.emails[0].value;
    data.nombre = profile.displayName;
    data.telefono = "";
    console.log(data);
    console.log(JSON.stringify(data));
    let ruta = baselink + "/usuario/insertar";
    console.log(ruta);
    fetch(ruta, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => console.log('Success:', response));
    console.log("Register");
}

function sendLogInRegister(correo) {
    var data = {};
    data.correo = correo;
    let ruta = baselink + "/inicioSesion/externo"
    fetch(ruta, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => console.log('Success:', response));
}


module.exports.validPassword = validPassword;
module.exports.genPassword = genPassword;
module.exports.issueJWT = issueJWT;
module.exports.externalLog = externalLog;
module.exports.sendNewUser = sendNewUser;
module.exports.sendLogInRegister = sendLogInRegister;