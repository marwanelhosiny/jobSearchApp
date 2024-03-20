import Joi from "joi";
import { objectidValidation } from "../../utils/idValidator.js";



export const addjobSchema = {
    body:Joi.object({
        jobTitle:Joi.string().min(2).max(50).required(),
        jobLocation:Joi.string().valid('onsite','remotely','hybrid').required(),
        workingTime:Joi.string().valid('part-time','full-time').required(),
        seniorityLevel:Joi.string().valid('Junior','Mid-Level','Senior','Team-Lead','CTO').required(),
        jobDescription:Joi.string(),
        technicalSkills:Joi.array().items(Joi.string()),
        softSkills:Joi.array().items(Joi.string())
    })
}


export const updatejobSchema = {
    body:Joi.object({
        jobLocation:Joi.string().valid('onsite','remotely','hybrid'),
        workingTime:Joi.string().valid('part-time','full-time'),
        seniorityLevel:Joi.string().valid('Junior','Mid-Level','Senior','Team-Lead','CTO'),
        jobDescription:Joi.string(),
        technicalSkills:Joi.array().items(Joi.string()),
        softSkills:Joi.array().items(Joi.string())
    }),
    params:Joi.object({
        jobId:Joi.string().custom(objectidValidation).required()
    })
}


export const deletejobSchema = {
    params:Joi.object({
        jobId:Joi.string().custom(objectidValidation).required()
    })
}


export const getjobscompanySchema = {
    params:Joi.object({
        jobId:Joi.string().custom(objectidValidation).required()
    })
}


export const getcompanyjobsSchema = {
    query:Joi.object({
        companyName:Joi.string().min(2).max(100).required()
    })
}


export const searchSchema = {
    body:Joi.object({
        jobTitle:Joi.string().min(2).max(50),
        jobLocation:Joi.string().valid('onsite','remotely','hybrid'),
        workingTime:Joi.string().valid('part-time','full-time'),
        seniorityLevel:Joi.string().valid('Junior','Mid-Level','Senior','Team-Lead','CTO'),
        technicalSkills:Joi.array().items(Joi.string()),
        softSkills:Joi.array().items(Joi.string())
    })
}

export const applyjobSchema={
    body:Joi.object({
        jobId:Joi.string().custom(objectidValidation).required(),
        companyId:Joi.string().custom(objectidValidation).required(),
        userTechSkills:Joi.array().items(Joi.string()),
        userSoftSkills:Joi.array().items(Joi.string()),
    })
}