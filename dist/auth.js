"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require('jsonwebtoken');
require('dotenv').config();
const mySecretKey = process.env.SECRET;
function generateToken(user) {
    return new Promise((resolve, reject) => {
        jwt.sign(user, mySecretKey, function (err, token) {
            if (err)
                reject(err);
            resolve(token);
        });
    });
}
const aa = {
    id: 4,
    username: 'sene',
    first_name: 'omoJesu',
    last_name: 'omoOlorun',
    email: 'sene@gmail.com'
};
// function verifyToken(req: updatedRequest, res: Response, next: NextFunction) {
//     const authHeader = req.headers['authorization']
//     const token = authHeader && authHeader.split(' ')[1]
//     if (token == null) return res.sendStatus(401)
// jwt.verify(token, mySecretKey, function(err: any, userPayLoad: userObjectType) {
//     if (err) return res.status(403).send({
//         errno : 106,
//         message : "Invalid token, please login again."
//     })
//     req.user = userPayLoad
//     next()
// }) 
// }
function verifyToken(token) {
    return new Promise((resolve, reject) => {
        jwt.verify(token, mySecretKey, function (err, decoded) {
            if (err)
                reject(err);
            resolve(decoded);
        });
    });
}
verifyToken("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJzZW5lIiwiZmlyc3RfbmFtZSI6Im9tb0plc3UiLCJsYXN0X25hbWUiOiJvbW9PbG9ydW4iLCJlbWFpbCI6InNlbmVAZ21haWwuY29tIiwiaWF0IjoxNjUyMzY3ODU1fQ.QVMMrx7Uv9dWa_IHhyxX08FetzDqrWx4RImTjg_ze5k")
    .then(res => console.log(res));
const tokenFunctions = {
    generateToken,
    verifyToken
};
module.exports = tokenFunctions;
