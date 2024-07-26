import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongoose';
import Folder from '@/app/models/Folder';
import User from '@/app/models/User';

// Function to get folders for a specific user by email
export async function GET(req) {
  await dbConnect();

  try {
    const userEmail = req.cookies.get('user_email').value;
    
    if (!userEmail) {
      return NextResponse.json({ status: 400, message: 'User email is required' });
    }

    // Find the user by email
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json({ status: 404, message: 'User not found' });
    }

    // Find folders associated with the user
    const folders = await Folder.find({ user: user._id }).populate('forms').populate('user', 'email');

    return NextResponse.json({ status: 200, folders });
  } catch (error) {
    console.error('Error fetching folders:', error);
    return NextResponse.json({ status: 500, message: 'Internal Server Error' });
  }
}


export async function POST(req) {
  await dbConnect();

  try {
    const data = await req.json();
    const { folderName, selectedForms } = data;
    const userEmail = req.cookies.get('user_email').value;
    const forms = selectedForms;
    // Find the user by email
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json({ status: 404, message: 'User not found' });
    }

    // Create a new folder with the user's reference and forms
    const newFolder = new Folder({
      folderName,
      forms,
      user: user._id,
    });

    await newFolder.save();

    return NextResponse.json({ status: 200, message: 'Folder created successfully', folder: newFolder });
  } catch (error) {
    console.error('Error creating folder:', error);
    return NextResponse.json({ status: 500, message: 'Internal Server Error' });
  }
}

export async function PUT(req) {
  await dbConnect();

  try {
    const data = await req.json();
    const { id, folderName, forms, userEmail } = data;

    // Find the user by email
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json({ status: 404, message: 'User not found' });
    }

    // Update the folder with the user's reference and forms
    const updatedFolder = await Folder.findByIdAndUpdate(
      id,
      { folderName, forms, user: user._id },
      { new: true }
    ).populate('forms').populate('user', 'email');

    if (!updatedFolder) {
      return NextResponse.json({ status: 404, message: 'Folder not found' });
    }

    return NextResponse.json({ status: 200, message: 'Folder updated successfully', folder: updatedFolder });
  } catch (error) {
    console.error('Error updating folder:', error);
    return NextResponse.json({ status: 500, message: 'Internal Server Error' });
  }
}

export async function DELETE(req) {
  await dbConnect();

  try {
    const { id } = await req.json();

    const deletedFolder = await Folder.findByIdAndDelete(id);

    if (!deletedFolder) {
      return NextResponse.json({ status: 404, message: 'Folder not found' });
    }

    return NextResponse.json({ status: 200, message: 'Folder deleted successfully' });
  } catch (error) {
    console.error('Error deleting folder:', error);
    return NextResponse.json({ status: 500, message: 'Internal Server Error' });
  }
}
