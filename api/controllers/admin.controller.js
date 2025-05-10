import User from '../models/user.model.js';
import Listing from '../models/listing.model.js';
import { errorHandler } from '../utils/error.js';
import bcryptjs from 'bcryptjs';

// Add a new agent
export const addAgent = async (req, res, next) => {
  try {
    const { username, email, password, agentLicense, specialties } = req.body;

    // Validate required fields
    if (!username || !email || !password || !agentLicense) {
      return next(errorHandler(400, 'Username, email, password, and agent license are required'));
    }

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(errorHandler(400, 'User already exists'));
    }

    // Hash the password
    const hashedPassword = bcryptjs.hashSync(password, 10);

    // Create a new agent
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      isAgent: true,
      agentLicense,
      specialties: specialties || [],
    });

    await newUser.save();

    res.status(201).json({
      success: true,
      message: 'Agent created successfully',
      user: {
        _id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        isAgent: newUser.isAgent,
        agentLicense: newUser.agentLicense,
        specialties: newUser.specialties,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Get admin dashboard statistics
export const getAdminStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalListings = await Listing.countDocuments();
    const premiumListings = await Listing.countDocuments({ regularPrice: { $gt: 1000000 } });
    const verifiedUsers = await User.countDocuments({ emailVerified: true });

    res.status(200).json({
      totalUsers,
      totalListings,
      premiumListings,
      verifiedUsers,
    });
  } catch (error) {
    next(error);
  }
};

// Get all users (without passwords)
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// Get a specific user by ID
export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return next(errorHandler(404, 'User not found!'));
    }
    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// Update user info
export const updateUser = async (req, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          isAdmin: req.body.isAdmin,
        },
      },
      { new: true }
    ).select('-password');

    if (!updatedUser) {
      return next(errorHandler(404, 'User not found!'));
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

// Delete a user
export const deleteUser = async (req, res, next) => {
  try {
    // Prevent users from deleting their own accounts
    if (req.params.id === req.user.id) {
      return next(errorHandler(400, 'You cannot delete your own account'));
    }

    const user = await User.findById(req.params.id);
    if (!user) {
      return next(errorHandler(404, 'User not found'));
    }

    // Delete listings created by this user
    await Listing.deleteMany({ userRef: req.params.id });

    // Delete user account
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json('User has been deleted!');
  } catch (error) {
    next(error);
  }
};

// Get all listings
export const getListings = async (req, res, next) => {
  try {
    const listings = await Listing.find();
    res.status(200).json(listings);
  } catch (error) {
    next(error);
  }
};

// Delete a listing
export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }

    await Listing.findByIdAndDelete(req.params.id);
    res.status(200).json('Listing has been deleted!');
  } catch (error) {
    next(error);
  }
};
