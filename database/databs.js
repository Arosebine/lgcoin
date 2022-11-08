const mongoose = require('mongoose');


// database 
const connectDB = async ()=>{
    await mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useCreateIndex: true,
}
   , function (err) {
        if (err) {
            console.error('Could not connect to MongoDB!');
            console.error(err);
            process.exit(1);
        }
    }
)};



try {
    
} catch (error) {
    
}


module.exports = connectDB;













