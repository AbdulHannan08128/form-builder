// app/api/register.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/app/lib/mongoose';
import User from '@/app/models/User';

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(req) {
  await dbConnect();

  try {
    const data = await req.json();
    const { name, email, password } = data;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists');
      return NextResponse.json({ status: 400, message: 'User already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    // Save the user to the database
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    // Send response to the frontend
    return NextResponse.json({ status: 200, message: 'Registration successful', token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error('Error:', error); // Use console.error for errors
    return NextResponse.json({ status: 500, message: 'Internal Server Error' });
  }
}
