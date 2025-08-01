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

AllStudentRouter.get('/student',AuthenticationMiddleware,async(req:Request,res:Response)=>{
    try{
        const {min,max} = req.query;
        const minAge = Number(min);
        const maxAge = Number(max);
        const allStudent = await StudentModel.find();
        const ReqStudent = allStudent && (allStudent.map((i)=>{
            if(i.age && i.age >= minAge && i.age<= maxAge){
                return i.toObject();
            } 
        }))
        res.status(200).json({
            Students : ReqStudent
        })
    }catch(err){
        const error = err as Error;
        res.status(500).json({
            message : error.message
        })
    }
})

export default AllStudentRouter;