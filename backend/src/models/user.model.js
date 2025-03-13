const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = mongoose.Schema({
    fullName : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        required : true,
    },
    profilePic : {
        type : String,
        default : "https://res.cloudinary.com/dygoctkdq/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1741767169/avatar_ikimgk.png",
    },
    role : {
        type : String,
        default : "Student",
    },
    wallet : {
        type : Number,
        default : 0,
    },
    about : {
        type : String,
        default : "Hey there! I'm using this platform to learn and grow 🚀",
    },
    coursesBuyied : [
        {
            videoUrl : {
                type : String,
                required : true,
            },
            thumbnailUrl :{
                type : String,
                required : true,
            },
            videoTitle : {
                type : String,
                required : true,
            },
            videoSubject : {
                type : String,
                required : true,
            },
            description : {
                type : String,
                required : true,
            },
            price : {
                type : Number,
                default : 0,
            }
        }
    ],
    yourCourse : [
        {
            videoUrl : {
                type : String,
                required : true,
            },
            thumbnailUrl :{
                type : String,
                required : true,
            },
            videoTitle : {
                type : String,
                required : true,
            },
            videoSubject : {
                type : String,
                required : true,
            },
            description : {
                type : String,
                required : true,
            },
            price : {
                type : Number,
                default : 0,
            }
        }
    ]
});

userSchema.pre("save", async function(next){       //The pre method ensures that data save hone se phle iske ander ka defined function execute hona chaiye
    const user = this; //here this store all the values of req.body + id    

    if(!user.isModified("password")){
        next();
    }

    try {
        const saltRound = await bcrypt.genSalt(10);
        const hash_password = await bcrypt.hash(user.password , saltRound);
        user.password = hash_password;
    } catch (error) {
        next(error);
    }
});

userSchema.methods.pwdCompare = async function(password) { // Compare the provided password with the hashed password using model method
    try {

        const isUser  = await bcrypt.compare(password, this.password); 
        return isUser ; 
    } catch (error) {
        console.error('Error during password comparison:', error);
    }
};

userSchema.methods.generateAuthToken = async function(){
    try {
        const token = jwt.sign(
            { 
              userId : this._id.toString(),
              email : this.email,
              role : this.role
            }
           , process.env.JWT_SECRET_KEY, 
            {
            expiresIn: "7d",
            }
        );
        
        return token;
    } catch (error) {
        console.error(error);
    }
}

const User = mongoose.model('User' , userSchema);
module.exports = User;