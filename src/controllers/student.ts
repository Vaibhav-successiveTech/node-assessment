import { Router } from 'express';
import { Request, Response } from 'express';
import StudentModel from '../models/student';
import { ValidateIdMiddleware, ValidateStudentDetails, AuthenticationMiddleware } from '../middleware/student';

const AllStudentRouter = Router();

AllStudentRouter.post('/add/student', AuthenticationMiddleware, ValidateStudentDetails, async (req: Request, res: Response) => {
    try {
        const { name, age, grade, email } = req.body;
        const newStudent = new StudentModel({ name: name, age: age, grade: grade, email: email });
        const dbresult = await newStudent.save();
        res.status(201).json({
            success: true,
            AddedStudent: dbresult,
        })
    } catch (err) {
        const error = err as Error;
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

AllStudentRouter.get('/student/:id', AuthenticationMiddleware, ValidateIdMiddleware, async (req: Request, res: Response) => {
    try {
        res.status(200).json({
            success: true,
            student: req.body.dbresp
        })

    } catch (err) {
        const error = err as Error;
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

AllStudentRouter.put('/update/student/:id', AuthenticationMiddleware, ValidateIdMiddleware, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, age, grade, email } = req.body;
        await StudentModel.findByIdAndUpdate(id, { name: name, age: age, grade: grade, email: email });
        const updatedStudent = await StudentModel.findById(id);
        res.status(200).json({
            success: true,
            UpdatedStudent: updatedStudent
        })
    } catch (err) {
        const error = err as Error;
        res.status(500).json({
            success: true,
            message: error.message
        })
    }
})

AllStudentRouter.delete('/delete/student/:id', AuthenticationMiddleware, ValidateIdMiddleware, async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const dbresp = await StudentModel.findByIdAndDelete(id);
        res.status(200).json({
            success: true,
            DeletedUser: dbresp
        })
    } catch (err) {
        const error = err as Error;
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
})

AllStudentRouter.get('/student', AuthenticationMiddleware, async (req: Request, res: Response) => {
    try {
        const { min, max } = req.query;
        const minAge = Number(min);
        const maxAge = Number(max);
        const allStudent = await StudentModel.aggregate([{
            $match:{
                age : {"$gte":minAge , "$lte":maxAge}
            }
        }]);
        res.status(200).json({
            Students: allStudent
        })
    } catch (err) {
        const error = err as Error;
        res.status(500).json({
            message: error.message
        })
    }
})

AllStudentRouter.get('/',async (req:Request,res:Response)=>{
    try{

        const pageNum = parseInt(req.query.page as string) 
        const size = parseInt(req.query.limit as string) 
        const sortBy = (req.query.sortBy as string) || "createdAt";
        const order = (req.query.order as string) === "desc" ? -1 : 1;

        const skipped = (pageNum - 1) * size;
        const allEntries = await StudentModel.find({}).skip(skipped).limit(size).sort({ [sortBy]: order })
        
        res.status(200).json({
            list : allEntries
        })
    }catch(err){
        const error = err as Error;
        res.status(500).json({
            message : error.message
        })
    }
})


export default AllStudentRouter;