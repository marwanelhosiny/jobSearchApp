import { Router } from "express";
import * as cc from "./company.controller.js"
import expressAsyncHandler from "express-async-handler";
import { validationFunction } from "../../middlewares/validation.middleware.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { systemRoles } from "../../utils/systemRoles.js";
import { addcompanySchema, appsondaySchema, deletecompanySchema, getcompanydataSchema, getjobapplicationsSchema, searchcompanySchema, updatecompanySchema } from "./company.schemas.js";

const router=Router()

router.post('/',validationFunction(addcompanySchema),auth([systemRoles.HR_ROLE]),expressAsyncHandler(cc.addCompany))
router.put('/:companyId',validationFunction(updatecompanySchema),auth([systemRoles.HR_ROLE]),expressAsyncHandler(cc.updateCompany))
router.delete('/:companyId',validationFunction(deletecompanySchema),auth([systemRoles.HR_ROLE]),expressAsyncHandler(cc.deleteCompany))
router.get('/companyJobs/:companyId',validationFunction(getcompanydataSchema),auth([systemRoles.HR_ROLE]),expressAsyncHandler(cc.getCompanyJobs))
router.get('/',validationFunction(searchcompanySchema),auth(),expressAsyncHandler(cc.searchCompany))
router.post('/applications/:companyId',validationFunction(getjobapplicationsSchema),auth([systemRoles.HR_ROLE]),expressAsyncHandler(cc.getCompanyApplications))
router.get('/apps/:companyId',validationFunction(appsondaySchema),auth([systemRoles.HR_ROLE]),expressAsyncHandler(cc.appsOnDay))





export default router