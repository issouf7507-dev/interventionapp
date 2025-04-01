import { google } from "googleapis";

export async function addToGoogleCalendar(intervention: any) {
  const auth = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
    // process.env.GOOGLE_REDIRECT_URI
  );

  //   auth.setCredentials({
  //     refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  //   });

  const calendar = google.calendar({ version: "v3", auth });

  const event = {
    summary: intervention.title,
    description: intervention.description,
    location: intervention.location,
    start: {
      dateTime: intervention.startDate,
      timeZone: "Africa/Abidjan",
    },
    end: {
      dateTime: intervention.endDate,
      timeZone: "Africa/Abidjan",
    },
  };

  const response = await calendar.events.insert({
    calendarId: "primary",
    requestBody: event,
  });

  return response.data;
}
