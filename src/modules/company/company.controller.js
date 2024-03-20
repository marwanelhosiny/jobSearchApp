import Application from "../../../DB/models/application.model.js";
import Company from "../../../DB/models/company.model.js";
import excelJS from 'exceljs';


//============================================ addCompany =============================//
export const addCompany= async(req,res,next)=>{
        const{companyName,desc,industry,address,numberOfEmployees,companyEmail}=req.body
        const{_id}=req.authUser

        //saving company in database
        const company = await Company.create({companyName,desc,industry,address,numberOfEmployees,companyEmail,companyHR:_id})

        //returning success message wwith company data
        return res.status(201).json({message:'company added successfully',company})

}


//========================================= updateCpmpany ============================//
export const updateCompany= async(req,res,next)=>{
        const{companyName,desc,address,numberOfEmployees,companyEmail}=req.body
        const{companyId}=req.params
        const{_id}=req.authUser

        //checking if company exists and belongs to authenticated user
        const company = await Company.findOne({_id:companyId,companyHR:_id})
        if(!company){return next(new Error('company does not exist',{cause:400}))}

        //check for duplication
        if(companyName || companyEmail){
            const isExist = await Company.findOne({$or:[{companyName},{companyEmail}]})
            if(isExist){return next(new Error('duplicated entry',{cause:400}))}
        }

        const updated= await Company.findByIdAndUpdate({_id:companyId},{companyName,desc,address,numberOfEmployees,companyEmail},{new:true})
        return res.status(200).json({message:"company data updated successfully",updated})
}


//======================================== deleteCompany ===============================//
export const deleteCompany= async(req,res,next)=>{
        const{companyId}=req.params
        const{_id}=req.authUser
        
        //checking if company exists and belongs to authenticated user then deleting if found
        const company= await Company.findOneAndDelete({_id:companyId,companyHR:_id})
        if(!company){return next(new Error('company does not exist',{cause:400}))}

        return res.status(200).json({message:"company data deleted successfully",company})
}


//===================================== getCompanyJobs ==================================//
export const getCompanyJobs= async(req,res,next)=>{
        const{companyId}=req.params
        const{_id}=req.authUser
        
        //checking if company exists and belongs to authenticated user
        const company = await Company.findOne({_id:companyId,companyHR:_id})
        if(!company){return next(new Error('company does not exist',{cause:400}))}
        
        const companyJobs= await Company.findById(companyId).populate('jobs').exec()
        return res.status(200).json({message:"company data",companyJobs})
}


//======================================= searchByName =================================//
export const searchCompany= async(req,res,next)=>{
        const{companyName}=req.query
        
        const company= await Company.findOne({companyName})
        if(!company){return next(new Error('no company matches this name',{cause:400}))}

        return res.status(200).json({message:"company data",company})
}


//================================== getCompanyApplications ===================================//
export const getCompanyApplications = async(req,res,next)=>{
        const{companyId}=req.params
        const{_id}=req.authUser

        //check if its authenticated user's company
        const company= await Company.findOne({_id:companyId,companyHR:_id})
        if(!company){return next(new Error('you dont has access on this company',{cause:400}))}

        //finding applications for comany
        const applications = await Application.find({companyId}).populate('userId')
        if(!applications){return next(new Error('no applications',{cause:400}))}
        
        return res.status(200).json({applications})
}

//================================ getApplicationsOnDay ==================================//
export const appsOnDay = async (req, res, next) => {
        const { day } = req.body;
        const { companyId } = req.params;
        const { _id } = req.authUser;

        // Check if it's authenticated user's company
        const company = await Company.findOne({ _id: companyId, companyHR: _id });
        if (!company) {
            return next(new Error('You don\'t have access to this company', { cause: 400 }));
        }

        // Set the beginning and the end of the day
        const startOfDay = new Date(day).setHours(0, 0, 0, 0);
        const endOfDay = new Date(day).setHours(23, 59, 59, 999);

        // Find the apps for one company and during one day
        const apps = await Application.find({ companyId, createdAt: { $gte: startOfDay, $lt: endOfDay } }).lean();
        if (!apps || apps.length === 0) {
            return next(new Error('No apps added in this day', { cause: 400 }));
        }

        // Create a new workbook and append the sheet
        const wb = new excelJS.Workbook();
        const ws = wb.addWorksheet('Sheet 1');

        // Add header row
        const headerRow = ['_id', 'jobId', 'companyId', 'userId', 'userTechSkills', 'userSoftSkills', 'userResumeUrl', 'createdAt', 'updatedAt'];
        ws.addRow(headerRow);

        // Add data rows
        apps.forEach(app => {
            ws.addRow([
                app._id.toString(),
                app.jobId.toString(),
                app.companyId.toString(),
                app.userId.toString(),
                app.userTechSkills.join(', '),
                app.userSoftSkills.join(', '),
                app.userResume.secure_url,
                new Date(app.createdAt).toLocaleString(),
                new Date(app.updatedAt).toLocaleString(),
            ]);
        });

        // Set a fixed width for all columns
        const fixedWidth = 25;
        ws.columns.forEach(column => {
            column.width = fixedWidth;
        });

        // Save the workbook as an Excel file
        const excelFileName = `./applications/${day}.xlsx`;
        await wb.xlsx.writeFile(excelFileName);

        res.status(200).json({ message: 'Excel file generated successfully', fileName: excelFileName });
};
