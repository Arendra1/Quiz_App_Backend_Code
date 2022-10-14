import mongoose, { Schema } from 'mongoose';


// Defining Schema
const idSchema = new mongoose.Schema({
    id:{type:String},
    count:{type:Number},
    quizName : {type:String , required: true , trim: true },
    category : {type:String , required: true , trim: true },
    difficultyLevel : {type:String , required: true }
})

    

// Model
const idModel = mongoose.model("incId" , idSchema)

export default idModel