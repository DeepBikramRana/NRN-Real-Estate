import bcryptjs from 'bcryptjs';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';
import Listing from '../models/listing.model.js';
import { v2 as cloudinary } from 'cloudinary'; // Add Cloudinary import
import multer from 'multer'; // Add Multer import

// Configure Cloudinary
cloudinary.config({
  cloud_name: 'ds9ojpney',
  api_key: '371283218295641',
  api_secret: 'sw8PftX8ScuPNzPXo6xc_Q8IuhI',
});

// Configure Multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage });

export const test = (req, res) => {
  res.json({
    message: 'Api route is working!',
  });
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, 'You can only update your own account!'));
  try {
    if (req.body.password) {
      req.body.password = bcryptjs.hashSync(req.body.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
          isAgent: req.body.isAgent,
          agentLicense: req.body.agentLicense,
          specialties: req.body.specialties,
        },
      },
      { new: true }
    );

    const { password, ...rest } = updatedUser._doc;

    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id)
    return next(errorHandler(401, 'You can only delete your own account!'));
  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie('access_token');
    res.status(200).json('User has been deleted!');
  } catch (error) {
    next(error);
  }
};

export const getUserListings = async (req, res, next) => {
  if (req.user.id === req.params.id) {
    try {
      const listings = await Listing.find({ userRef: req.params.id });
      res.status(200).json(listings);
    } catch (error) {
      next(error);
    }
  } else {
    return next(errorHandler(401, 'You can only view your own listings!'));
  }
};

export const getUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
  
    if (!user) return next(errorHandler(404, 'User not found!'));
  
    const { password: pass, ...rest } = user._doc;
  
    res.status(200).json(rest);
  } catch (error) {
    next(error);
  }
};

// Updated getAgents controller to use isAgent boolean field
export const getAgents = async (req, res, next) => {
  try {
    const agents = await User.find({ isAgent: true })
      .select('-password'); // Remove the .populate() that was causing issues
    
    res.status(200).json(agents);
  } catch (error) {
    console.error('Error fetching agents:', error);
    next(error);
  }
};

// New function for uploading images to Cloudinary
export const uploadImage = async (req, res, next) => {
  try {
    console.log('Received file:', req.file); // Log the received file for debugging
    if (!req.file) {
      return next(errorHandler(400, 'No file uploaded'));
    }

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'listings' },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error); // Log full error object
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(req.file.buffer);
    });

    res.status(200).json({ url: result.secure_url });
  } catch (error) {
    console.error('Upload error:', error); // Log full error object
    next(errorHandler(500, error.message || 'Failed to upload image to Cloudinary'));
  }
};

// Export Multer middleware for use in routes
export const uploadMiddleware = upload.single('image');