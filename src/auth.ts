import express, { Application, Request, Response, NextFunction } from 'express';
const jwt = require('jsonwebtoken');
require('dotenv').config()

const mySecretKey = process.env.SECRET

function generateToken(user: any) {
    return new Promise((resolve, reject) => {
        jwt.sign(user, mySecretKey, function(err: any, token: string) {
            if (err) reject(err)
            resolve(token)
        })
    })
}

function verifyToken(req: Request, res: Response, next: NextFunction) {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)

    jwt.verify(token, mySecretKey, function(err: any, user: object) {
        if (err) return res.status(403).send({
            errno : 106,
            message : "Invalid token, please login again."
        })
        req.user = user
        next()
    }) 
}

const tokenFunctions = {
    generateToken,
    verifyToken
}

module.exports = tokenFunctions