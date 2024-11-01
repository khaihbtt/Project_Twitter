// import mongoose from "mongoose";


// const connectMongoDB = (url) => {
//     return mongoose
//         .connect(url)
//         .then(() => {
//             console.log("connectMongoDB successfully");
//         })
//         .catch((e) => console.log("MongoDB connection error:", e)); // Truyền biến 'e' vào catch
// };
// // const connectMongoDB = async () => {
// //     try {
// //         const conn = await mongoose.connect(process.env.MONGO_URI)
// //         console.log(`MongoDB connected: ${conn.connection.host}`)
// //     } catch (error) {
// //         console.error(`Error connection to mongoDB: ${error.message}`);
// //         process.exit(1);
// //     }
// // }

// export default connectMongoDB;
import mongoose from "mongoose";

const connectMongoDB = async (url) => {
    try {
        await mongoose.connect(url);
        console.log("connectMongoDB successfully");
    } catch (error) {
        console.log("MongoDB connection error:", error); // In thông báo lỗi chi tiết
    }
};

export default connectMongoDB;
