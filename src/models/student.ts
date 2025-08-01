import { Schema, model } from "mongoose";
const Student = new Schema({
    name: String,
    age: Number,
    grade: String,
    email: String,
    createdAt : {
        type : Date,
        default : Date.now()
    }

})

const StudentModel = model('student',Student);
export default StudentModel;