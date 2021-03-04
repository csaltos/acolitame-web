const crypto = require('crypto');
const jsonwebtoken = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const database = require('../config/database');

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
// // function validPassword(password, hash, salt) {
// //     var hashVerify = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
// //     return hash === hashVerify;
// }

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
// function genPassword(password) {
//     var salt = crypto.randomBytes(32).toString('hex');
//     var genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
    
//     return {
//       salt: salt,
//       hash: genHash
//     };
// }


/**
 * @param {*} user - The user object.  We need this to set the JWT `sub` payload property
 */
function issueJWT(user) {
  const id = user.id;
  const name = user.name;
  const admin = user.admin;
  const local = user.local;
  // const expiresIn = '1d';
  const expiresIn = 86400;
  const payload = {
    sub: id,
    name: name,
    admin: admin,
    local: local,
    iat: Date.now()/1000
  };
  console.log(payload);
  const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn: '1d', algorithm: 'RS256' });
  return {
    token: signedToken,
    expires: expiresIn
  }
}

// function valAuth(user){
//   const clave = user.clave;
//   const nombre = user.nombre;
//   const claveH = user.claveH;
//   const sal = user.sal;
//   console.log(nombre,claveH,sal);
//   return validPassword(clave,claveH,sal);
// }

function isValidEntry(entry) {
    var format = /[`!#$%^&*()+\-=\[\]{};':"\\|,<>\/?~]/;
    return !format.test(entry);
}


function sendNewUser(profile,done, admin) { //Profile -> Objeto con informacion de usuario recuperada de cuenta de google o facebook.
    var data = {};
    // data.clave = "";
    data.correo = profile.emails[0].value;
    data.displayName = profile.displayName;
    // data.telefono = "";
    // data.salt = "";
    data.extAuth = true;
    data.id = profile.id;
    data.admin = admin
    console.log(data);
    console.log(JSON.stringify(data));
    var query
    if (admin)
      query = `INSERT INTO public.administrador_empresa( id_administrador,correo) 
                    values ('${data.id}', '${data.correo}');`
    else
      query = `INSERT INTO public.usuario_registrado( id_usuario,correo, nombre ,extauth)
                    values ('${data.id}', '${data.correo}', '${data.displayName}',true);`
    console.log(query);
    console.log("inserting new user");
    database.query(query)
    .then(function (dbres) {
      // console.log(dbres);  
      // database.end();
        console.log(dbres.rowCount);
        if (dbres.rowCount > 0 ){    
            console.log("insert good");
            return done(null,data);
        }else{
            console.log("insert bad");
            return done(null,false);
        }
    })
    .catch(function (err) {
        console.log(err);
        // database.end();
        return done(err,false);
    });
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


// module.exports.validPassword = validPassword;
// module.exports.genPassword = genPassword;
module.exports.issueJWT = issueJWT;
module.exports.sendNewUser = sendNewUser;
module.exports.sendLogInRegister = sendLogInRegister;
module.exports.isValidEntry = isValidEntry;
// module.exports.valAuth = valAuth;