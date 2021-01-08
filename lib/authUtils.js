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
  const admin = user.admin;
  // const expiresIn = '1d';
  const expiresIn = 86400;
  const payload = {
    sub: id,
    name: name,
    admin: admin,
    iat: Date.now()/1000
  };
  const signedToken = jsonwebtoken.sign(payload, PRIV_KEY, { expiresIn: '1d', algorithm: 'RS256' });
  return {
    token: "Bearer " + signedToken,
    expires: expiresIn
  }
}

function valAuth(user){
  const clave = user.clave;
  const nombre = user.nombre;
  const claveH = user.claveH;
  const sal = user.sal;
  console.log(nombre,claveH,sal);
  return validPassword(clave,claveH,sal);
}

function isValidEntry(entry) {
    var format = /[`!#$%^&*()+\-=\[\]{};':"\\|,<>\/?~]/;
    return !format.test(entry);
}


function sendNewUser(profile,done) { //Profile -> Objeto con informacion de usuario recuperada de cuenta de google o facebook.
    var data = {};
    data.clave = "";
    data.correo = profile.emails[0].value;
    data.nombre = profile.displayName;
    data.telefono = "";
    data.salt = "";
    data.extAuth = true;
    data.id = profile.id;
    console.log(data);
    console.log(JSON.stringify(data));
    const query = `INSERT INTO public.usuario_registrado( id_usuario,clave, sal, correo, nombre, telefono, verificado,extauth)
                    VALUES (${data.id},'${data.clave}', '${data.salt}', '${data.correo}', '${data.nombre}', '${data.telefono}', true,true);`
    console.log("Inserting new user");
    database.query(query)
    .then(function (dbRes) {
      console.log(dbRes);  
      // database.end();
        if (dbRes.rowCount > 0 ){    
            console.log("Insert good");
            return done(null,profile);
        }else{
            console.log("Insert bad");
            return done(null,false);
        }
    })
    .catch(function (err) {
        console.log(err);
        // dataBase.end();
        return done(err,false);
    });
    
    // let ruta = baselink + "/usuario/insertar";
    // fetch(ruta, {
    //         method: 'POST',
    //         body: JSON.stringify(data),
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     }).then(res => res.json())
    //     .catch(error => console.error('Error:', error))
    //     .then(response => console.log('Success:', response));
    // console.log("Register");
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
module.exports.sendNewUser = sendNewUser;
module.exports.sendLogInRegister = sendLogInRegister;
module.exports.isValidEntry = isValidEntry;
module.exports.valAuth = valAuth;