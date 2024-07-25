import { NextResponse } from 'next/server';
import dbConnect from '@/app/lib/mongoose'; // Adjust the path as necessary
import Form from '@/app/models/Form'; // Adjust the path as necessary

export async function POST(req) {
  await dbConnect();

  try {
    // Extract form data from request body
    const data = await req.json();
    const { formName, fields } = data;

    // Check if form with the same name already exists (optional)
    const existingForm = await Form.findOne({ formName });
    if (existingForm) {
      console.log('Form with this name already exists');
      return NextResponse.json({ status: 400, message: 'Form with this name already exists' });
    }

    // Create a new form
    const form = new Form({
      formName,
      fields,
    });

    // Save the form to the database
    await form.save();

    // Send response to the frontend
    return NextResponse.json({ status: 200, message: 'Form created successfully', form: { id: form._id, formName: form.formName, fields: form.fields } });
  } catch (error) {
    console.error('Error:', error); // Use console.error for errors
    return NextResponse.json({ status: 500, message: 'Internal Server Error' });
  }
}
