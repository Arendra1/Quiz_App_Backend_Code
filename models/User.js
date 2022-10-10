import mongoose from 'mongoose'

// Defining Schema
const userSchema = new mongoose.Schema({
    name : {type:String , required: true , trim: true},
    email : {type:String , required: true , trim: true},
    accessLevel : {type:String , required: true , trim: true},
    password : {type:String , required: true , trim: true},
    score : {type:Number , default:0 }
})

// Model
const UserModel = mongoose.model("user" , userSchema)

export default UserModel