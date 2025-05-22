import express from "express";
import mongoose, { model } from "mongoose";
import jwt from "jsonwebtoken";
import { UserModel } from "./db";
const app = express();
app.use(express.json());

const JWT_PASSWORD="purohit7796";

app.post("/api/v1/signup", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    try {
        await UserModel.create({
            username: username,
            password: password
        })

        res.json({
            message: "User signed up"
        })
    }catch(e){
        res.status(411).json({
            message:"User already exists"
        })
    }
})

app.post("/api/v1/signin", async(req, res) => {
    const username=req.body.username;
    const password=req.body.password;

    const existingUser=await UserModel.findOne({
        username,password
    })
    if(existingUser){
        const joken=jwt.sign({
            id:existingUser._id
        },JWT_PASSWORD)
        res.json({
            joken
        })
    }else{
        res.status(403).json({
            message:"Incorrect Credential"
        })
    }

})

app.get("/api/v1/content", (req, res) => {

})



app.delete("/api/v1/content", (req, res) => {

})

app.post("/api/v1/brain/share", (req, res) => {

})

app.get("/api/v1/brain/:sharelink", (req, res) => {

})

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
