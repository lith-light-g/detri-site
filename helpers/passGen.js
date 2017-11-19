const crypto = require("crypto");

const iterations = 1700000,
      hashAlgo = "sha256",
      size = 32;

let passwordModule = {};

passwordModule.generatePassword = (pass) => {
    let password = {};
    let salt, hash;
    return new Promise((resolve, reject) => {
        if (!pass) {
            resolve(undefined);
        }
        crypto.randomBytes(size, (err, buf) => {
            if (err) {
                reject(err);
            }
            salt = buf.toString("hex");
            console.log(salt.length);
            console.time("pass_gen");
            crypto.pbkdf2(pass, salt, iterations, size, hashAlgo, (err, derivedKey) => {
                if (err) {
                    console.timeEnd("pass_gen");
                    reject(err);
                }
                console.timeEnd("pass_gen");
                // the key derived from the pbkdf2 algo is our hash
                hash = derivedKey.toString("hex");
                console.log(hash.length);
                resolve(hash + salt);
            });
        });
    });
}

passwordModule.verifyPass = (pass, saltedHash) => {
    const passHash = saltedHash.slice(0, 64);
    const passSalt = saltedHash.slice(-64);
    return new Promise((resolve, reject) => {
        crypto.pbkdf2(pass, passSalt, iterations, size, hashAlgo, (err, derivedKey) => {
            if (err) {
                reject(err);
            }
            if (derivedKey.toString("hex") === passHash) {
                resolve(true);
            } else {
                resolve(false);
            }
        });
    });
}

module.exports = passwordModule;