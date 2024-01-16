import mongoose from "mongoose";

const connectDB = async () => {
  try {  
        await mongoose.connect(process.env.MONGO_URI,{ useUnifiedTopology: true });
        console.log("Connected to Database ...")
    } catch(error) {
        console.log("Error connection to Db",error)
        process.exit(1);
    }
}

export default connectDB;