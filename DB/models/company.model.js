import { Schema, model } from "mongoose";




const companySchema= new Schema({
    companyName:{
        type:String,
        required:true,
        unique:true,
        trim:true,
    },
    desc:{
        type:String,
        default:"no describtion added yet"
    },
    industry:{
        type:String,
        required:true
    },
    address:{
        country:{
            type:String,
            required:true
        },
        city:{
            type:String,
            required:true
        }
    },
    numberOfEmployees:{
        start:{
            type:Number,
            required:true
        },
        end:{
            type:Number,
            requried:true
        }
    },
    companyEmail:{
        type:String,
        unique:true,
        required:true
    },
    companyHR:{
        type:Schema.Types.ObjectId,
        ref:"user",
        unique:true
    }
},{timestamps:true})

companySchema.set("toObject",{virtuals:true})
companySchema.set("toJSON",{virtuals:true})

companySchema.virtual('jobs',{
    ref:'job',
    localField:'companyHR',
    foreignField:'addedBy'
})

const Company=model('company',companySchema)

export default Company