import StudentModel from "./models/student"
const PopulateStudent = async ()=>{
    for(let i=0;i<50;i++){
        const newStudent = new StudentModel({name:`Student${i}`,age:20 + i,grade:'A',email:`${i}@gmail.com`});
        const resp = await newStudent.save();
    }
}

export default PopulateStudent;