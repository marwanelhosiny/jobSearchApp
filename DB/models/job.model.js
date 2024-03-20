import { Schema, model } from "mongoose";


const jobSchema = new Schema({
    jobTitle:{
        type:String,
        required:true
    },
    jobLocation:{
        type:String,
        enum:['onsite','remotely','hybrid'],
        required:true
    },
    workingTime:{
        type:String,
        enum:['part-time','full-time'],
        required:true
    },
    seniorityLevel:{
        type:String,
        enum:['Junior','Mid-Level','Senior','Team-Lead','CTO'],
        required:true
    },
    jobDescription:{
        type:String,
        default:"no description added yet"
    },
    technicalSkills:[{type:String}],
    softSkills:[{type:String}],
    addedBy:{
        type:Schema.Types.ObjectId,
        ref:'user',
        required:true
    }

},{timestamps:true})

jobSchema.set("toObject",{virtuals:true})
jobSchema.set("toJSON",{virtuals:true})

jobSchema.virtual('company',{
    ref:'company',
    localField:'addedBy',
    foreignField:'companyHR'
})


const Job = model('job',jobSchema)

export default Job