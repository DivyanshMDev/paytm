const mongoose=require("mongoose");

mongoose.connect("mongodb+srv://modidivyansh16314:LLvYlG1JzYIZK6ky@cluster0.cexkljq.mongodb.net/Paytmm");
const userSchema=mongoose.Schema({
    username:String,
    password:String,
    firstName:String,
    lastName:String,

})
const accountSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, // Reference to User model
        ref: 'User',
        required: true
    },
    balance: {
        type: Number,
        required: true
    }
});

const Account = mongoose.model('Account', accountSchema);

const User=mongoose.model("User",userSchema);

module.exports={
    User,Account
};