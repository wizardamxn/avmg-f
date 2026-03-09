// app/api/webhook/route.js
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    // 1. Pick up the phone! (Parse the JSON sent by your Express Worker)
    const payload = await request.json();

    console.log("====================================");
    console.log("🔔 WEBHOOK RECEIVED IN NEXT.JS!");
    console.log(`Job ID: ${payload.jobId}`);
    console.log(`Status: ${payload.status}`);
    console.log(`File: ${payload.downloadUrl}`);
    console.log("====================================");

    // 2. Here is where you would normally update your database
    // so the frontend knows this specific job is finished.

    // 3. Hang up the phone (Tell the worker "Message Received!")
    return NextResponse.json({ success: true, message: "Webhook acknowledged." }, { status: 200 });

  } catch (error) {
    console.error("Webhook processing failed:", error);
    return NextResponse.json({ error: "Invalid webhook payload" }, { status: 400 });
  }
}