import { Schema, model, Document, Types } from 'mongoose'
import bcrypt from 'bcryptjs'
import { TCommonUser } from '@shared/types/user'

// 1. Define a specific interface for the Mongoose User Document
// This extends the shared TUser type (for common fields)
// and Mongoose's Document (for Mongoose methods and default _id, timestamps)
// It also explicitly adds backend-only fields like 'password'.
export interface IUserMongooseDocument extends TCommonUser, Document {
  _id: Types.ObjectId
  password: string // Add the password property specifically for the Mongoose document
  comparePassword(candidatePassword: string): Promise<boolean> // Method for password comparison
  favoriteShowTmdbIds: number[] // Favorites
}

const UserSchema = new Schema<IUserMongooseDocument>(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      minlength: [3, 'Username must be at least 3 characters long']
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/.+@.+\..+/, 'Please fill a valid email address']
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters long']
    },
    favoriteShowTmdbIds: {
      type: [Number],
      default: []
    }
  },
  {
    timestamps: true // Automatically adds createdAt and updatedAt
  }
)

// Hash the password before saving the user document
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next()
  }
  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error: any) {
    next(error)
  }
})

// Method for password comparison
UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password)
}

// Create and export the User model
const User = model<IUserMongooseDocument>('User', UserSchema)
export default User
