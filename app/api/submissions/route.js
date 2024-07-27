import { NextResponse } from "next/server";
import Form from "@/app/models/Form";
import User from "@/app/models/User";
import FormSubmission from "@/app/models/FormSubmission";
import connectToDatabase from "@/app/lib/mongoose";

export async function POST(req) {
    let email = req.cookies.get('user_email')?.value;

    if (!email) {
        return NextResponse.json({ status: 405, message: 'User Not Authenticated' });
    }

    await connectToDatabase();

    // Find the user by email
    let user = await User.findOne({ email: email });

    if (!user) {
        return NextResponse.json({ status: 405, message: 'User Not Authenticated' });
    }

    // Get form ID from request
    let { ID } = await req.json();

    // Find the form by formId
    let form = await Form.findOne({ formId: ID });

    if (!form) {
        return NextResponse.json({ status: 404, message: 'Form Not Found' });
    }

    // Check if the user is allowed to see the form data
    if (form.user.toString() !== user._id.toString()) {
        return NextResponse.json({ status: 406, message: 'User is Not Allowed To See the Data' });
    }

    // Find form submissions related to the form
    let submissions = await FormSubmission.find({ form: form._id });

    return NextResponse.json({
        status: 200,
        form,
        submissions
    });
}
