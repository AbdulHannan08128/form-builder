import { NextResponse } from "next/server";
import Folder from "@/app/models/Folder";

export async function POST(req) {
    let data = await req.json();
    let ID = data.ID;
    
    try {
        // Fetch folder by ID and populate forms
        let folder = await Folder.findOne({ folderId: ID }).populate('forms');

        if (!folder) {
            return NextResponse.json({ status: 404, message: "Folder not found" });
        }

        return NextResponse.json({ status: 200, folder });
    } catch (err) {
        console.error(err);
        return NextResponse.json({ status: 500, message: "Internal Server Error" });
    }
}
