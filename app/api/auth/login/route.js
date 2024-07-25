// app/api/login/route.js
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dbConnect from '@/app/lib/mongoose';
import User from '@/app/models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key';

export async function POST(req) {
  await dbConnect();

  try {
    const data = await req.json();
    const { email, password } = data;

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ status: 400, message: 'Invalid email or password' });
    }

    // Compare the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ status: 400, message: 'Invalid email or password' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });

    // Send response to the frontend
    return NextResponse.json({ status: 200, message: 'Login successful', token, user: { id: user._id, name: user.name, email: user.email } });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json({ status: 500, message: 'Internal Server Error' });
  }
}
