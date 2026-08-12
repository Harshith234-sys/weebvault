import express from "express";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authMiddleware from "../middleware/authMiddleware.js";


 const router = express.Router();

 router.post("/register",async (req,res) => {
    try{
        const {username , email , password} = req.body;
        if(!username || !email || !password){
            return res.status(400).json({
                message: "All fields are required"
            });
        }
        const existingUser = await User.findOne({
            $or: [{username},{email}]
        });
        if(existingUser){
            return res.status(400).json({
                message: "Username or Email aldready exists"
            });
        }
        const hashedPassword = await bcrypt.hash(password,10);
        const user = await User.create({
            username,
            email,
            password: hashedPassword
        });
        res.status(201).json({
            message: "User Registered Succesfully",
            user: {
                id:user._id,
                username: user.username,
                email: user.email
            }
        });
    }catch(error){
        console.error("Registration Error",error.message);
        res.status(500).json({
            message: "Registration Failed"
        });
    }

 });
 router.post("/login", async (req,res) =>{
    try{
        const {email,password} = req.body;
        if(!email || !password){
            return res.status(400).json({
                message: "Email and password are required"
            });
        }
        const user = await User.findOne({email});
        if(!user){
            return res.status(401).json({
                message: "Invalid username or password"
            });
        }
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );
        if(!passwordMatch){
            return res.status(401).json({
                message: "Invalid email or password"
            });
        }
        const token = jwt.sign({
            userId: user._id
        },
        process.env.JWT_SECRET,
        {
            expiresIn: "7d"
        }
        );
        res.json({
            message: "Login Successful",
            token,
            user:{
                id: user._id,
                username: user.username,
                email: user.email
            }
        });

    }catch(error){
        console.error("Login Error",error.message)
        res.status(500).json({
            message: "Login Failed"
        });
    }
 });
router.get("/protected", authMiddleware, (req, res) => {
    res.json({
        message: "You accessed a protected route",
        userId: req.userId
    });
});

export default router;