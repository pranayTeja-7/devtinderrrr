const { json } = require("express");
const {User} = require("../models/user.js")
const jwt = require("jsonwebtoken");


// const userAuth = async (req, res, next) => {
//     try{
//         const authHeader = req.headers.authorization;
//         if(authHeader){
//             const token = authHeader.split(" ")[1];
//             // console.log(token);
//             const payLoad = jwt.verify(token, "jddjfdjfn");
//             // console.log(payLoad.userId);
//             req.user = await User.findById(payLoad.userId);
//             next();
//         }
//         else{
//             return res.status(401).send("authentication failed");
//         }
//     }
//     catch(err){
//         console.log(err);
//         res.status(401).send("something went wrong")
//     }

    
// }

const userAuth = async (req, res, next) => {
    try{
        const cookies = req.cookies;
        console.log(cookies);
        const {token} = cookies;
        if(!token){
            throw new Error("invalid token, please login")
        }
        const payLoad = jwt.verify(token, "jddjfdjfn");
        // console.log(payLoad);
        const {userId} = payLoad;
        const user = await User.findById(userId);
        req.user = user;
        next();
    }
    catch(err){
        console.log(err.message);
        res.status(401).send(err.message);
    }

}

const isAdmin = (req, res, next) => {
    try{
        if(req.user.role === "admin"){
            next();
        }

        else{
            return res.status(403).send("unauthorized");
        }
    }
    catch(err){
        console.log(err);
        res.status(403).send("unauthorized");
    }
}

module.exports = {userAuth, isAdmin}