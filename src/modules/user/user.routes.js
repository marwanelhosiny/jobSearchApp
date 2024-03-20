import { Router } from "express";
import * as uc from "./user.controller.js"
import expressAsyncHandler from "express-async-handler";
import { validationFunction } from "../../middlewares/validation.middleware.js";
import { changepassSchema, forgetpasswordSchema, getUsersbyrecoveryemailSchema, showprofileSchema, signinSchema, signupSchema, userupdateSchema } from "./user.schemas.js";
import { auth } from "../../middlewares/auth.middleware.js";

const router=Router()

router.post('/',validationFunction(signupSchema),expressAsyncHandler(uc.signUp))
router.post('/login',validationFunction(signinSchema),expressAsyncHandler(uc.signIn))
router.put('/',validationFunction(userupdateSchema),auth(),expressAsyncHandler(uc.userUpdate))
router.delete('/',auth(),expressAsyncHandler(uc.userDelete))
router.get('/showMyData',auth(),expressAsyncHandler(uc.showMyData))
router.get('/profile/:_id',validationFunction(showprofileSchema),expressAsyncHandler(uc.showUserProfile))
router.patch('/changePass',validationFunction(changepassSchema),auth(),expressAsyncHandler(uc.changePass))
router.post('/forgetPass',validationFunction(forgetpasswordSchema),expressAsyncHandler(uc.forgetPassword))
router.post('/recover',validationFunction(getUsersbyrecoveryemailSchema),expressAsyncHandler(uc.getUsersByRecoveryEmail))











export default router