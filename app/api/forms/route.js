import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongoose';
import Form from '@/app/models/Form';
import User from '@/app/models/User';

export async function GET(req) {
  await dbConnect();

  try {
    const userEmail = req.cookies.get('user_email').value;

    // Find the user by email
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json({ status: 404, message: 'User not found' });
    }

    // Retrieve forms associated with the user
    const forms = await Form.find({ user: user._id }).populate('user', 'email');

    return NextResponse.json({ status: 200, forms });
  } catch (error) {
    console.error('Error fetching forms:', error);
    return NextResponse.json({ status: 500, message: 'Internal Server Error' });
  }
}

export async function POST(req) {
  await dbConnect();

  try {
    const data = await req.json();
    const { formName, fields } = data;
    const userEmail = req.cookies.get('user_email').value;

    // Find the user by email
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json({ status: 404, message: 'User not found' });
    }

    // Create a new form with the user's reference
    const newForm = new Form({
      formName,
      fields,
      user: user._id,
    });

    await newForm.save();

    return NextResponse.json({ status: 200, message: 'Form created successfully', form: newForm });
  } catch (error) {
    console.error('Error creating form:', error);
    return NextResponse.json({ status: 500, message: 'Internal Server Error' });
  }
}


export async function PUT(req) {
  await dbConnect();

  try {
    const data = await req.json();
    const { id: formId, formName, fields } = data;

    const userEmail = req.cookies.get('user_email')?.value;

    // Validate request data
    if (!formId || !formName || !fields || !Array.isArray(fields)) {
      return NextResponse.json({ status: 400, message: 'Invalid input data' });
    }

    // Validate userEmail
    if (!userEmail) {
      return NextResponse.json({ status: 400, message: 'User email is required' });
    }

    // Find the user by email
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return NextResponse.json({ status: 404, message: 'User not found' });
    }

    // Process fields without _id or id
    const updatedFields = fields.map(field => {
      // Ensure field has the required properties
      return {
        type: field.type || '',
        label: field.label || '',
        options: field.options || [],
        defaultOption: field.defaultOption || '',
        // If _id is missing, it will be omitted from the document update
      };
    });

    // Find and update the form
    const updatedForm = await Form.findOneAndUpdate(
      { formId, user: user._id }, // Find the form by formId and ensure it belongs to the user
      { formName, fields: updatedFields }, // Fields to update
      { new: true, runValidators: true } // Return the updated document and run validators
    ).populate('user', 'email'); // Populate user to return the user details if needed

    if (!updatedForm) {
      return NextResponse.json({ status: 404, message: 'Form not found' });
    }

    return NextResponse.json({ status: 200, message: 'Form updated successfully', form: updatedForm });

  } catch (error) {
    console.error('Error updating form:', error);
    return NextResponse.json({ status: 500, message: 'Internal Server Error' });
  }
}

export async function DELETE(req) {
  await dbConnect();

  try {
    const { id } = await req.json(); // Custom ID from request body

    // Check if id is provided
    if (!id) {
      return NextResponse.json({ status: 400, message: 'ID is required' });
    }

    // Find the form by custom field (e.g., formId)
    const deletedForm = await Form.findOneAndDelete({ formId: id });

    // Check if the form was found and deleted
    if (!deletedForm) {
      return NextResponse.json({ status: 404, message: 'Form not found' });
    }

    return NextResponse.json({ status: 200, message: 'Form deleted successfully' });
  } catch (error) {
    console.log('Error deleting form:', error);
    return NextResponse.json({ status: 500, message: 'Internal Server Error' });
  }
}