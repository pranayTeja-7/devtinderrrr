const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const {connectDB} = require("./database.js");
const {User} = require("./models/user.js");
const {userAuth, isAdmin} = require("./middlewares/auth.js");


const app = express();
app.use(express.json());
app.use(cookieParser());


app.post("/user/signup", async (req,res) => {
    try{
        const rawPassword = req.body.password;
        const hashedPassword = await bcrypt.hash(rawPassword, 10);
        req.body.password = hashedPassword;
        const user = new User(req.body);
        await user.save();
        res.send("user saved successfully");
    }
    catch(err){
        console.log("err = ", err);
        res.status(400).send("something went wrong");
    }

})


app.post("/user/login", async (req, res) => {
    try{
        const {emailID, password} = req.body;
        const user = await User.findOne({emailID: emailID})
        if(!user){
            console.log(user)
            return res.status(401).send("invalid credentials");
        }
        const match = await bcrypt.compare(password, user.password);
        if(match){
            const token = jwt.sign( {userId: user._id,}, "jddjfdjfn", {expiresIn: "7d"} )
            res.cookie("token", token, {expires: new Date(Date.now() + 7*24*60*60*1000)});
            res.send(token);
        }
        else{
            return res.status(401).send("invalid credentials");
        }
    }
    catch(err){
        console.log("err = ", err);
        res.status(400).send("something went wrong");
    }
})

app.get("/user/all", async (req,res) => {

    try{
        const users = await User.find();
        console.log(users);
        res.send(users);
    }
    catch(err){
        console.log("err = ", err);
        res.status(400).send("something went wrong");
    }

})


app.get("/user/one", userAuth, async (req,res) => {
    
    try{
        const user = await User.findOne({emailID: req.query.emailID});
        // console.log(user);
        if(user){
            res.send(user);
        }
        else{
            res.status(404).send("user not found");
        }
    }
    catch(err){
        console.log("err = ", err);
        res.status(500).send("something went wrong");
    }
})

app.get("/user", userAuth, async (req, res) => {
    try{
        const user = req.user
        res.send(user);
    }
    catch(err){
        console.log("err = ", err);
        res.status(500).send("something went wrong");
    }
})

app.patch("/user/one", async (req, res) => {
    try{
        const updatableFields = ["firstName", "lastName", "age"]
        const user = await User.findOne({emailID: req.query.emailID});
        if(!user){
            res.status(404).send("user not found");
            return;
        }
        console.log(user);
        for(const key in req.body){
            if(updatableFields.includes(key)){
                user[key] = req.body[key];
            }
        }
        await user.save();
        res.send(user);
    }
    catch(err){
        console.log(err)
        res.status(500).send("something went wrong");
    }
})


app.patch("/user/:id", async (req, res) => {
    try{
        const updatableFields = ["firstName", "lastName", "age"];
        const updatedFields = {};
        for(key in req.body){
            if(updatableFields.includes(key)){
                updatedFields[key] = req.body[key];
            }
            // else{
            //     return res.status(400).send("cannot update user");
            // }
        }
        const updatedUser = await User.findByIdAndUpdate(req.params.id, updatedFields, {
            returnDocument: "after",
            runValidators: true,
        });
        if(!updatedUser){
            return res.status(404).send("user not found")
        }
        res.send(updatedUser);
    }
    catch(err){
        console.log(err)
        res.status(500).send("something went wrong");
    }

})

app.delete("/user/:id", async (req, res) => {
    try{
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if(!deletedUser){
            return res.status(404).send("user not found")
        }
        res.send({
            message : "user deleted succesfully",
            deletedUser,
        });
    }
    catch(err){
        console.log(err);
        res.status(500).send('something went wrong');
    }
})

connectDB().then(() => {
    console.log("connected to DB");
    app.listen(6000, () => {
        console.log("server listening on port 6000");
    })
}).catch((err) => {
    console.log("err =, ", err);
    
});


