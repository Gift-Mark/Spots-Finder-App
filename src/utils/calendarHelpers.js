// Generates a Google Calendar URL
export function getGoogleCalendarUrl(event) {
  const startTime = new Date(event.startDate).toISOString().replace(/-|:|\.\d\d\d/g, "");
  const endTime = new Date(event.endDate).toISOString().replace(/-|:|\.\d\d\d/g, "");

  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    details: event.description,
    location: event.location,
    dates: `${startTime}/${endTime}`,
  });

  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

// Generates and downloads an .ics file for Apple Calendar / Outlook
export function downloadIcsFile(event) {
  const startTime = new Date(event.startDate).toISOString().replace(/-|:|\.\d\d\d/g, "");
  const endTime = new Date(event.endDate).toISOString().replace(/-|:|\.\d\d\d/g, "");

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//JosPulse//Culture Events//EN",
    "BEGIN:VEVENT",
    `SUMMARY:${event.title}`,
    `DESCRIPTION:${event.description}`,
    `LOCATION:${event.location}`,
    `DTSTART:${startTime}`,
    `DTEND:${endTime}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute("download", `${event.id}-event.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}