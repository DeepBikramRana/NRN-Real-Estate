import User from "../models/user.model.js";  // Correct import
import bcrypt from 'bcryptjs';  // Fixed typo (from 'bycrypt' to 'bcryptjs')
import { errorHandler } from "../utils/error.js";

export const signup = async (req, res, next) => {
    const { username, email, password } = req.body;  // Fixed typo
    try {
        // Use bcrypt to hash the password
        const hashedPassword = bcrypt.hashSync(password, 10);

        // Create a new user instance with the hashed password
        const newUser = new User({ username, email, password: hashedPassword });

        // Save the new user to the database
        await newUser.save();

        // Send a success response
        res.status(201).json("User created successfully!");
    } catch (error) {
        next(error);
    }
};