import { NextResponse } from 'next/server';
import connectToDatabase from '@/app/lib/mongoose';
import FormSubmission from '@/app/models/FormSubmission';
import Form from '@/app/models/Form';

export async function POST(req) {
  try {
    // Parse the request body to get the form data
    const { formId, responses } = await req.json();

    console.log('Received form submission:', { formId, responses });

    // Validate the input
    if (!formId || !responses) {
      console.log('Missing required fields');
      return NextResponse.json({ status: 400, message: 'Missing required fields' });
    }

    // Connect to the database
    await connectToDatabase();
    console.log('Connected to database');

    // Check if the form exists
    const form = await Form.findOne({ formId });
    if (!form) {
      console.log('Form not found');
      return NextResponse.json({ status: 404, message: 'Form not found' });
    }

    console.log('Form found:', form);

    // Save the form submission
    const submission = new FormSubmission({
      form: form._id,
      responses,
    });

    await submission.save();
    console.log('Form submission saved:', submission);

    return NextResponse.json({ status: 201, message: 'Form submitted successfully', submission });
  } catch (error) {
    console.error('Error submitting form:', error);
    return NextResponse.json({ status: 500, message: 'Internal Server Error' });
  }
}
