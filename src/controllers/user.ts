import { Router, Request, Response } from "express";
import { AuthenticationMiddleware } from "../middleware/student";
const UserRouter = Router();

UserRouter.post('/signup',(req:Request,res:Response)=>{
    try{   
        const {userName,email,password} = req.body;
        if(!userName||!email||!password){
            res.status(400).json({
                message : 'Invalid credentails'
            })
            return;
        }
        res.status(201).json({
            success : true,
            message : 'User Created',
            token : 'password'
        })
    }catch(err){
        const error = err as Error;
        res.status(500).json({
            success : false,
            message : error.message
        })
    }
})

UserRouter.post('/login',AuthenticationMiddleware,(req:Request,res:Response)=>{
    try{
        const {name,password} = req.body;
        if(!name || !password){
            res.status(400).json({
                message : 'Invalid Credentials'
            })
            return;
        }
        res.status(200).json({
            message : `User ${name}` 
        })
    }catch(err){
        const error = err as Error;
        res.status(500).json({
            success : true,
            message : error.message
        })
    }
})