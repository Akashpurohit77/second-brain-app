import mongoose from "mongoose";
import {model,Schema} from "mongoose";
import dotenv from "dotenv";
dotenv.config();

// const MONGO_URL = "mongodb://127.0.0.1:27017/second-brain-app";
const db_url=process.env.ATLASDB_URL;
if (!db_url) {
  throw new Error("ATLASDB_URL is not defined in .env");
}
mongoose.connect(db_url);

const UserSchema=new Schema({
    username:{type: String, unique:true},
    password: String
})

export const UserModel=model("User",UserSchema);


const ContentSchema=new Schema({
    title:String,
    link:String,
    tags:[{type:mongoose.Types.ObjectId, ref:'Tag'}],
    userId:{type:mongoose.Types.ObjectId, ref:'User', required:true}
})

export const ContentModel=model("Content",ContentSchema);

const LinkSchema=new Schema({
  hash:String,
  userId:{type:mongoose.Types.ObjectId, ref:'User', required:true,unique:true }
})

export const LinkModel=model("Links",LinkSchema);