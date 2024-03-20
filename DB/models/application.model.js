import { Schema, model } from "mongoose";


const applicationSchema = new Schema({
    jobId:{
        type:Schema.Types.ObjectId,
        ref:'job'
    },
    companyId:{
        type:Schema.Types.ObjectId,
        ref:'company'
    },
    userId:{
        type:Schema.Types.ObjectId,
        ref:'user'
    },
    userTechSkills:[{type:String}],
    userSoftSkills:[{type:String}],
    userResume:{
        secure_url:{type:String,required:true},
        public_id:{type:String,required:true}
    }
},{timestamps:true})


const Application = model('application',applicationSchema)


export default Application