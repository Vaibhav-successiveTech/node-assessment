import { NextFunction, Request, Response } from "express";
import StudentModel from "../models/student";
import zod from 'zod';

const StudentSchema = zod.object({
    name: zod.string(),
    age: zod.number(),
    grade: zod.string().min(1).max(1),
    email: zod.string().email()
})

const AuthenticationMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const token = req.headers['token'];
    if (token !== 'password') {
        res.status(400).json({
            message: 'Invalid user'
        })
        return;
    }
    next();
}

const ValidateStudentDetails = (req: Request, res: Response, next: NextFunction) => {
    const result = StudentSchema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({
            success: false,
            message: 'Invalid feilds'
        })
        return;
    }
    next();
}

const ValidateIdMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const dbresp = await StudentModel.findById(id);
    if (!dbresp) {
        res.status(400).json({
            message: 'No such user exist'
        });
        return;
    }
    req.body = {};
    req.body.dbresp = dbresp;
    next();
} 

export {ValidateIdMiddleware, ValidateStudentDetails, AuthenticationMiddleware};