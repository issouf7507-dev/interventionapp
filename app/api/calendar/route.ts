import { google } from "googleapis";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { intervention } = await request.json();

    // Vérification des dates
    if (!intervention.startDate || !intervention.endDate) {
      return NextResponse.json(
        { error: "Start date and end date are required" },
        { status: 400 }
      );
    }

    console.log("Received dates:", {
      startDate: intervention.startDate,
      endDate: intervention.endDate,
    });

    const auth = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    auth.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
      access_token: process.env.GOOGLE_ACCESS_TOKEN,
    });

    const calendar = google.calendar({ version: "v3", auth });

    // Conversion des dates avec validation
    const startDate = new Date(intervention.startDate);
    const endDate = new Date(intervention.endDate);

    if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
      return NextResponse.json(
        { error: "Invalid date format" },
        { status: 400 }
      );
    }

    console.log("Converted dates:", {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });

    const event = {
      summary: intervention.title,
      description: intervention.description,
      location: intervention.location,
      start: {
        dateTime: startDate.toISOString(),
        timeZone: "Africa/Abidjan",
      },
      end: {
        dateTime: endDate.toISOString(),
        timeZone: "Africa/Abidjan",
      },
    };

    console.log("Event object:", event);

    const response = await calendar.events.insert({
      calendarId: "primary",
      requestBody: event,
    });

    return NextResponse.json(response.data);
  } catch (error) {
    console.error("Google Calendar API error:", error);
    return NextResponse.json(
      { error: "Failed to create calendar event" },
      { status: 500 }
    );
  }
}
