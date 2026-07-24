const express = require("express");
const mongoose = require("mongoose");
const {connectDB} = require("./database.js");
const {User} = require("./models/user.js");
const app = express();
app.use(express.json());


app.post("/user", async (req,res) => {
    try{
        const user = new User(req.body);
        await user.save()
        res.send("user saved successfully");
    }
    catch(err){
        console.log("err = ", err);
        res.send("something went wrong");
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


app.get("/user/one", async (req,res) => {
    
    try{
        const user = await User.findOne({emailID: req.query.emailID});
        console.log(user);
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

app.patch("/user/one", async (req, res) => {
    try{
        const updatableFields = ["firstName", "lastName", "age"]
        const user = await User.findOne({emailID: req.query.emailID});
        if(!user){
            res.status(404).send("user not found")
        }
        console.log(user);
        for(key in req.body){
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


connectDB().then(() => {
    console.log("connected to DB");
    app.listen(6000, () => {
        console.log("server listening on port 6000");
    })
}).catch((err) => {
    console.log("err =, ", err);
    
});


