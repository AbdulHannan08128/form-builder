import { NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/mongoose";
import Form from "@/app/models/Form";

export async function POST(req) {
  try {
    // Parse the request body to get the ID
    const { ID } = await req.json();

    // Validate the ID
    if (!ID || ID === '') {
      return NextResponse.json({ status: 400, message: 'No ID Received' });
    }

    // Connect to the database
    await connectToDatabase();

    // Find the form by ID
    const form = await Form.findOne({ formId: ID });

    // Check if the form was found
    if (!form) {
      return NextResponse.json({ status: 404, message: 'Form Not Found' });
    }

    // Return the form data
    return NextResponse.json({ status: 200, form });
  } catch (error) {
    console.error('Error fetching form:', error);
    return NextResponse.json({ status: 500, message: 'Internal Server Error' });
  }
}
