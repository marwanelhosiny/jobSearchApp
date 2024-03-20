import Joi from "joi";
import { objectidValidation } from "../../utils/idValidator.js";


export const addcompanySchema={
    body:Joi.object({
        companyName:Joi.string().min(2).max(100).required(),
        desc:Joi.string(),
        industry:Joi.string().required(),
        address:Joi.object({
            city:Joi.string().min(2).max(50).required(),
            country:Joi.string().min(2).max(50).required()
        }),
        numberOfEmployees:Joi.object({
            start:Joi.number().required(),
            end:Joi.number().required()
        }).required(),
        companyEmail:Joi.string().email().required()
    })
}

export const updatecompanySchema={
    body:Joi.object({
        companyName:Joi.string().min(2).max(100),
        desc:Joi.string(),
        address:Joi.object({
            city:Joi.string().min(2).max(50).required(),
            country:Joi.string().min(2).max(50).required()
        }),
        numberOfEmployees:Joi.object({
            start:Joi.number().required(),
            end:Joi.number().required()
        }),
        companyEmail:Joi.string().email()
    }),
    params:Joi.object({
        companyId:Joi.string().custom(objectidValidation).required()
    })
}


export const deletecompanySchema={
    params:Joi.object({
        companyId:Joi.string().custom(objectidValidation).required()
    })
}


export const getcompanydataSchema={
    params:Joi.object({
        companyId:Joi.string().custom(objectidValidation).required()
    })
}


export const searchcompanySchema={
    query:Joi.object({
        companyName:Joi.string().min(2).max(100).required(),
    })
}


export const getjobapplicationsSchema={
    params:Joi.object({
        companyId:Joi.string().custom(objectidValidation).required()
    })
}


export const appsondaySchema={
    params:Joi.object({
        companyId:Joi.string().custom(objectidValidation).required()
    }),
    body:Joi.object({
        day:Joi.date().required()
    })
}