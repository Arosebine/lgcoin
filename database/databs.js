const mongoose = require('mongoose');


// database 
const connectDB = async ()=>{

try {
    await mongoose.connect(process.env.DB_URI, )
    console.log('database connected');
} catch (error) {
    console.error('Could not connect to MongoDB!');

}
   
};






module.exports = connectDB;













