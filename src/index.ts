import express from "express";
import mongoose, { model } from "mongoose";
import jwt from "jsonwebtoken";
import { ContentModel, LinkModel, UserModel } from "./db";
const app = express();
app.use(express.json());
import { JWT_PASSWORD } from "./config";
import { userMiddleware } from "./middleware";
import { random } from "./utils";
import cors from "cors";
app.use(cors());

// types.d.ts
import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }
}



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

app.post("/api/v1/content", userMiddleware, async (req, res) => {

    const link=req.body.link;
    const title=req.body.title;

    await ContentModel.create({
        link,
        title,
        // @ts-ignore 
        userId:req.userId,
        tags:[]
    })
    res.json({
        message:"Content added"
    })
})

app.get("/api/v1/content", userMiddleware, async (req, res) => {
    // @ts-ignore 
    const userId=req.userId;
    const content=await ContentModel.find({
        userId:userId
    }).populate("userId","username")
    res.json({
        content
    })
})

app.delete("/api/v1/content", userMiddleware,async(req, res) => {
    const contentId=req.body.contentId;
    await ContentModel.deleteMany({
        contentId,
        // @ts-ignore 
        userId:req.userId
    })
    res.json({
        message:"content deleted"
    })
})

app.post("/api/v1/brain/share", userMiddleware,async (req, res) => {
    const share=req.body.share;
    if(share){

        const existingLink=await LinkModel.findOne({
            userId:req.userId
        })
        if(existingLink){
            res.json({
                hash:existingLink.hash
            })
        }
        const hash=random(10);
        await LinkModel.create({
            userId: req.userId,
            hash
        })
        res.json({
            hash
        })
    }else{
        await LinkModel.deleteOne({
            userId:req.userId
        })
        res.json({
        message:"Removed Link"
    })
    }
    
})

app.get("/api/v1/brain/:shareLink",async (req, res) => {
    const hash=req.params.shareLink;
    const link=await LinkModel.findOne({
        hash
    });
    if(!link){
        res.status(411).json({
            message:"Sorry incorrect input"
        })
        return;
    }
    const content=await ContentModel.find({
        userId:link.userId
    })
    const user=await UserModel.findOne({
        _id:link.userId
    })
    if(!user){
        res.status(411).json({
            message:"user not found"
        })
        return;
    }
    res.json({
        username:user.username,
        content:content
    })
})

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
