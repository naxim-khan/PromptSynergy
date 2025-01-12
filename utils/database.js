import mongoose from "mongoose";

let isConnected = false;

export const connectToDB = async()=>{
    mongoose.set('strictQuery', true)

    if(isConnected){
        console.log('MongoDB is already Connected')
        return;
    }

    try{
        await mongoose.connect(process.env.MONGODB_URI, {
            dbName:"share_prompt",
            useNewUrlParser: true, 
            useUnifiedTopology: true
        })
        console.log('MongoDB Connected Successfully')
        isConnected = true;
    }catch(err){
        console.error('Error Connecting to MongoDB:',err)
        process.exit(1)
    }
}