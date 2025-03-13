const User = require('../models/user.model');

const cloudinary = require('../config/cloudinary.config');
const fs = require("fs");
const path = require("path");

const profiledata = async(req,res) => {
    const  email  = req.user.email;
    try {
        const user = await User.findOne({email});
        if(!user) return res.status(400).json({message : "No user found"});
        res.status(200).json({profilePic : user.profilePic , fullName : user.fullName , role : user.role , email , coursesBuyied : user.coursesBuyied, wallet : user.wallet, about: user.about, userId : user._id})
    } catch (error) {
        console.log("Error in generalSetting" , error);
        res.status(500).json({ message : "Internal Server Error"})
    }
}

const updateProfilePic = async(req,res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    try {
        const upload = await cloudinary.uploader.upload(req.file.path , {
                    resource_type : "image",
                    folder : "kringstep/profilePics"
        });

        fs.unlink(req.file.path, (err) => {  //deleting the local storage
                    if (err) console.error("Error deleting file:", err);
                    else console.log("File deleted:", req.file.path);
        });

        const updatedProfilePic = await User.findByIdAndUpdate(req.user.userId,
            {
                profilePic : upload.secure_url,
            },
            { new: true }
        )

        if (!updatedProfilePic) {
            return res.status(404).json({ error: "User not found" });
        }

        res.status(200).json({ 
            message: "profilePic updated successfully",
            profilePicUrl: upload.secure_url,
            user: updatedProfilePic
        });

    } catch (error) {
        console.log("Error in updateProfilePic" , error);
        res.status(500).json({ message : "Internal Server Error"})
    }
}

const updateProfile = async(req,res) => {
    const { fullName, about } = req.body;
    try {
        const updatedUser = await User.findByIdAndUpdate(req.user.userId,
            {
                fullName,
                about,
            },
            { new: true }
        )
        if(!updatedUser) return res.status(200).json({ "message" : "user not updated"});
        
        res.status(200).json({ updatedUser })
    } catch (error) {
        console.log("Error in updateProfile" , error);
        res.status(500).json({ message : "Internal Server Error"})
    }
}

const addBalance = async(req,res) => {
    const { balance } = req.body;
    try{
        const user = await User.findByIdAndUpdate(
            req.user.userId , {
                $inc : { wallet : balance},
            },{ new: true }
        )
        if(!user) return res.status(404).json({message : "User Not Found"})
        
        return res.status(200).json({ message : `Successfully added ₹${balance} to your wallet`})
    } catch(error) {
        console.log("Error in addBalance" , error);
        res.status(500).json({ message : "Internal Server Error"})
    }   
}

const withdrawBalance = async(req,res) => {
    const { balance } = req.body;
    try{
        const checkUser = await User.findById(req.user.userId);
        if(!checkUser) return res.status(404).json({message : "User Not Found"});

        if(checkUser.wallet < balance ) return res.status(200).json({message : "Insufficient funds for withdrawl!"});

        const user = await User.findByIdAndUpdate(
            req.user.userId , {
                $inc : { wallet : -balance},
            },{ new: true }
        )
        if(!user) return res.status(404).json({message : "User Not Found"})
        
        return res.status(200).json({ message : `Successfully withdrawn a balance of ₹${balance}.`})
    } catch(error) {
        console.log("Error in withdrawBalance" , error);
        res.status(500).json({ message : "Internal Server Error"})
    }   
}

module.exports = { updateProfilePic , updateProfile , profiledata , addBalance , withdrawBalance}