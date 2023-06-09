import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from "../models/user.js";

//Auth Sign In
export const authSignin = async (req, res) => {
    const { email, password } = req.body;

  try {
    const oldUser = await User.findOne({ email });

    if (!oldUser) return res.status(404).json({ message: "User doesn't exist" });

    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);

    if (!isPasswordCorrect) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ email: oldUser.email, id: oldUser._id }, 'secret', { expiresIn: "1h" });

    res.status(200).json({ result: oldUser, token });
  } catch (err) {
    
    res.status(500).json({ message: "Something went wrong" });
  }
};


//Auth SignUp
export const authSignup = async (req, res) => {
     const { email, password, confirmPassword, firstName, lastName } = req.body;
    // console.log(req.body)
  try {
    const oldUser = await User.findOne({ email });

    if (oldUser) return res.status(400).json({ message: "User already exists" });

    if(password !== confirmPassword) return res.status(400).json({message: "Passwords don't match."})

    const hashedPassword = await bcrypt.hash(password, 12);

    const result = await User.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    const token = jwt.sign( { email: result.email, id: result._id }, 'secret', { expiresIn: "1h" } );

    res.status(201).json({ result, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
    
    // console.log(error);
  }
};