import User from "../../../DB/models/user.model.js"
import bcrypt from "bcryptjs"
import  jwt  from "jsonwebtoken"
import generateUniequeString from "../../utils/generateUniqueString.js"
import axios from "axios"

//============================================== register api =======================================//
export const signUp=async(req,res,next)=>{
    //destructing enteries from req
    const{firstName,lastName,email,recoveryEmail,password,DOB,role,mobileNumber}=req.body

    //checking if email or mobilePhone duplicated
    const isExist = await User.findOne({$or:[{email},{mobileNumber}]})
    if(isExist){return next(new Error('duplicated entry',{cause:400}))}
    
    //hashing password before storing in database
    const hashedPass=bcrypt.hashSync(password,9)

    //creating document with all required data
    const addUser= await User.create({firstName,lastName,username:`${firstName}${lastName}`,email,recoveryEmail,password:hashedPass,DOB,role,mobileNumber})

    //navigating to login api to make the user logins directly after registering
    axios({
        method : "post",
        url: "http://localhost:3000/user/login",
        data:{email,password},
    }).then((response)=>{return res.status(201).json({message:'user registered successfully',response:response.data})}
    )
    .catch((error)=>{return next(new Error(error.data,{cause:400}))})
}


//============================================= login api ==========================================//
export const signIn =async(req,res,next)=>{
    const{email,password}=req.body
    const online='online'
    const offline='offline'
    //checking email accuaracy and changing status too
    const isExist = await User.findOneAndUpdate({email},{status:online})
    if(!isExist){return next(new Error('invalid credentials',{cause:400}))}

    //checking password accuaracy
    const checkPass=bcrypt.compareSync(password,isExist.password)
    if(!checkPass){return next(new Error('invalid credentials',{cause:400}))}

    //creating token to send back in the response
    const{username,_id}=isExist
    const token =  jwt.sign({email,username,_id},process.env.ACCESSTOKEN_SECRETKEY,{expiresIn:"1h"})
    return res.status(200).json({message:"you signed in successfully",token})
}


//=========================================== updateUser api ========================================//
export const userUpdate=async(req,res,next)=>{
    const{email,mobileNumber,recoveryEmail,DOB,lastName,firstName}=req.body
    const{_id}=req.authUser

    //setting new username for user if he updates one of his names
    let username;
    if(firstName&&lastName){username=`${firstName}${lastName}`}
    else if(firstName){username=`${firstName}${req.authUser.lastName}`}
    else if(lastName){username=`${req.authUser.firstName}${lastName}`}

    //checking if email or mobilePhone duplicated
    const isExist = await User.findOne({$or:[{email},{mobileNumber}]})
    if(isExist){return next(new Error('duplicated entry',{cause:400}))}

    //updating the sent fields and returning the new document 
    const updated=await User.findByIdAndUpdate({_id},{username,firstName,lastName,email,mobileNumber,recoveryEmail,DOB},{new:true})
    return res.status(200).json({messsage:"user updated successsfully",updated})
}


//=========================================== deleteUser api ======================================//
export const userDelete=async(req,res,next)=>{
    const{_id}=req.authUser

    //deleting user and returning deleted document 
    const deleted=await User.findByIdAndDelete({_id})
    return res.status(200).json({messsage:"user deleted successsfully",deleted})
}


//=========================================== showMyProfile api =================================//
export const showMyData = async(req,res,next)=>{

    //distructing all data except password cannot send hashed pass in response even if he is account owner
    const{_id,firstName,lastName,username,email,DOB,mobileNumber,role,status,createdAt,updatedAt}=req.authUser
    return res.status(200).json({_id,firstName,lastName,username,email,DOB,mobileNumber,role,status,createdAt,updatedAt})

}


//=========================================== showUserProfile api =================================//
export const showUserProfile = async(req,res,next)=>{
    const{_id}=req.params
    
    const findUser = await User.findById(_id,'firstName lastName DOB role status')
    if(!findUser){return next(new Error('user does not exist',{cause:400}))}
    return res.status(200).json({message:`user's profile`,findUser})
}


//=========================================== changePassword api ===============================//
export const changePass= async(req,res,next)=>{
    const{newPass,oldPass}=req.body
    const{_id}=req.authUser

    //check old pass
    const checkPass=bcrypt.compareSync(oldPass,req.authUser.password)
    if(!checkPass){return next(new Error('invalid credentials',{cause:400}))}

    //hashing the new pass
    const hashedPass=bcrypt.hashSync(newPass,+process.env.SALT_ROUNDS)

    //updating database
    const passUpdate= await User.updateOne({_id},{password:hashedPass})
    if(!passUpdate.modifiedCount){return next(new Error('update failed',{cause:400}))}
    return res.status(200).json({message:"password updated Successfully",passUpdate})
}


//========================================== forgetPassword========================================//
export const forgetPassword= async(req,res,next)=>{
    const{email}=req.body
    
    //check if email accurate
    const isExist = await User.findOne({email})
    if(!isExist){return next(new Error('invalid email',{cause:400}))}

    //creating a new pass for user
    const newPass=generateUniequeString(6)
    const hashedPass=bcrypt.hashSync(newPass,process.env.SALT_ROUNDS)

    //update pass in db
    const passUpdate= await User.updateOne({email},{password:hashedPass})

    //generating one time token for user
    const{username,_id}= isExist
    const OTP=jwt.sign({email,username,_id},"secretKey",{expiresIn:"10m"})

    return res.status(200).json({message:"its recommended to change pass",newPass,OTP})

}


//========================================== getUsersByRecoveryEmail========================================//
export const getUsersByRecoveryEmail= async(req,res,next)=>{
    const{recoveryEmail}=req.body

    //find users connected by same recovery emails and returning their emails
    const Users =await User.find({recoveryEmail},'email')
    if(!Users){return next(new Error('invalid recoveryEmail',{cause:400}))}
    return res.status(200).json({message:"emails",Users})
}

