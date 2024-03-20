import Application from "../../../DB/models/application.model.js";
import Company from "../../../DB/models/company.model.js";
import Job from "../../../DB/models/job.model.js";
import cloudinaryConnection from "../../utils/cloudinary.js";


//=================================== addJob ==================================//
export const addJob= async(req,res,next)=>{
    const{jobTitle,jobLocation,workingTime,seniorityLevel,jobDescription,technicalSkills,softSkills}=req.body
    const{_id}=req.authUser

    //saving job in database
    const job = await Job.create({jobTitle,jobLocation,workingTime,seniorityLevel,jobDescription,technicalSkills,softSkills,addedBy:_id})

    //returning success message wwith company data
    return res.status(201).json({message:'job added successfully',job})

}


//=================================== updateJob ===============================//
export const updateJob= async(req,res,next)=>{
    const{jobLocation,workingTime,seniorityLevel,jobDescription,technicalSkills,softSkills}=req.body
    const{jobId}=req.params
    const{_id}=req.authUser

    //checking if job exists and added by authenticated user
    const job = await Job.findOne({_id:jobId,addedBy:_id})
    if(!job){return next(new Error('job does not exist',{cause:400}))}

    const updated= await Job.findByIdAndUpdate({_id:jobId},{jobLocation,workingTime,seniorityLevel,jobDescription,technicalSkills,softSkills},{new:true})
    return res.status(200).json({message:"job data updated successfully",updated})

}

//================================== deleteJob ================================//
export const deleteJob= async(req,res,next)=>{
    const{jobId}=req.params
    const{_id}=req.authUser
    
    //checking if job exists and belongs to authenticated user then deleting if found
    const job= await Job.findOneAndDelete({_id:jobId,addedBy:_id})
    if(!job){return next(new Error('job does not exist',{cause:400}))}

    return res.status(200).json({message:"job data deleted successfully",job})
}


//=============================== getJobsCompany ====================================//
export const getJobsCompany = async(req,res,next)=>{
    const{jobId}=req.params

    //finding job and its company data 
    const jobsCompany= await Job.findById(jobId).populate('company').exec()
    if(!jobsCompany){return next(new Error('job does not exist',{cause:400}))}

    return res.status(200).json({message:"job data",jobsCompany})
}


//================================ getCompanyJobs ===================================//
export const getCompanyJobs = async(req,res,next)=>{
    const{companyName}=req.query

    //finding company and its jobs data 
    const companyJobs= await Company.findOne({companyName}).populate('jobs').exec()
    if(!companyJobs){return next(new Error('company does not exist',{cause:400}))}

    return res.status(200).json({message:"company data",companyJobs})
}


//================================= SearchJobs =======================================//
export const searchJobs = async(req,res,next)=>{
    const{jobTitle,jobLocation,workingTime,seniorityLevel,technicalSkills}=req.body

    let conditions=[]
    //check which fillter is sent and which is undefined
    if(jobTitle)conditions.push({jobTitle})
    if(jobLocation)conditions.push({jobLocation})
    if(workingTime)conditions.push({workingTime})
    if(seniorityLevel)conditions.push({seniorityLevel})
    if(technicalSkills)conditions.push({technicalSkills})

    //check which if there any fillter
    if(!conditions.length){return next(new Error('choose at least one filter',{cause:400}))}

    const search = await Job.find({$and:conditions})
    if(!search){return next(new Error('no jobs matches your filters',{cause:400}))}

    return res.status(200).json({message:'search result',search})
}


//=================================== applyJob ====================================//
export const applyJob= async(req,res,next)=>{
    const{jobId,companyId,userTechSkills,userSoftSkills}=req.body
    const{_id}=req.authUser

    if(!req.file){return next(new Error('resume must be uploaded'))}

    //upload resume in spesefic folder on host and destructing url and public id
    const {secure_url,public_id} = await cloudinaryConnection().uploader.upload(req.file.path,{
        folder:`searchJob-App/resumes/${jobId}/${_id}`,
        resource_type:"raw",
        access_mode:"public"
    })

    //add application to database
    const application = await Application.create({jobId,companyId,userId:_id,userTechSkills,userSoftSkills,userResume:{secure_url,public_id}}) 

    if(!application){
    // Roll back Cloudinary upload and delete folder
        await cloudinaryConnection().uploader.destroy(public_id)
        await cloudinaryConnection().api.delete_folder(`searchJob-App/resumes/${jobId}/${_id}`)
        return next(new Error('failed to add application to database',{cause:400}))
    }

    return res.status(201).json({message:'application added successfully',application})
}