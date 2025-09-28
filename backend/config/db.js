import mongoose from "mongoose";

export const connectDB=async ()=>{
    await mongoose.connect('mongodb+srv://omgunturkar_PMT:projectManagement@cluster0.qvhfpbf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
    .then(()=>{
        console.log("DB Connected")
    })
    
}