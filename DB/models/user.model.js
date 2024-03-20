import { Schema, model } from "mongoose";


const userSchema= new Schema({
    firstName:{
        type:String,
        trim:true,
        required:true
    },
    lastName:{
        type:String,
        trim:true,
        required:true
    },
    username:{
        type:String,
        required:true
    },
    email:{
        type:String,
        unique:true,
        required:true
    },
    recoveryEmail:{
        type:String
    },
    password:{
        type:String,
        required:true
    },
    DOB:{
        type:Date,
        required:true
    },
    mobileNumber:{
        type:String,
        required:true,
        unique:true
    },
    role:{
        type:String,
        enum:['User','Company_HR']
    },
    status:{
        type:String,
        enum:['online','offline'],
        default:'offline'
    }
},{timestamps:true})

const User =model('user',userSchema)

export default User