


let middleware = {};

middleware.decodePayload = function (req,res,next) {
    user = {
        sub: '-1',
        name: 'anonymous',
        admin: false,
        local: false,
        iat: -1,
        exp: -1
    }
    console.log(req.cookies['token']);
    if (req && req.cookies['token']){
        // const jwt = req.cookies['token'].replace('Bearer ','').trim();
        const jwt = req.cookies['token'].trim();
        const base64String = jwt.split('.')[1];
        const decodePayload = JSON.parse(Buffer.from(base64String,'base64').toString('utf8'));
        user = decodePayload;
    }

    req.user = user;
    return next();
}

module.exports = middleware;