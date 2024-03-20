import { Router } from "express";
import * as jc from "./job.controller.js"
import expressAsyncHandler from "express-async-handler";
import { validationFunction } from "../../middlewares/validation.middleware.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { systemRoles } from "../../utils/systemRoles.js";
import { addjobSchema, applyjobSchema, deletejobSchema, getcompanyjobsSchema, getjobscompanySchema, searchSchema, updatejobSchema } from "./job.schemas.js";
import { multermiddleware } from "../../middlewares/multerMiddleware.js";
import { allowedExtensions } from "../../utils/allowedExtensions.js";

const router=Router()

router.post('/',validationFunction(addjobSchema),auth(systemRoles.HR_ROLE),expressAsyncHandler(jc.addJob))
router.put('/:jobId',validationFunction(updatejobSchema),auth(systemRoles.HR_ROLE),expressAsyncHandler(jc.updateJob))
router.delete('/:jobId',validationFunction(deletejobSchema),auth(systemRoles.HR_ROLE),expressAsyncHandler(jc.deleteJob))
router.get('/:jobId',validationFunction(getjobscompanySchema),auth(),expressAsyncHandler(jc.getJobsCompany))
router.post('/companyJobs',validationFunction(getcompanyjobsSchema),auth(),expressAsyncHandler(jc.getCompanyJobs))
router.post('/search',validationFunction(searchSchema),auth(),expressAsyncHandler(jc.searchJobs))
router.post('/apply',multermiddleware(allowedExtensions.application).single('resume'),validationFunction(applyjobSchema),auth(systemRoles.USER_ROLE),expressAsyncHandler(jc.applyJob))






export default router