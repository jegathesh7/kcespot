const eventEmailTemplate = (event, fromUser) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${event.title}</title>
</head>
<body style="font-family: Arial, sans-serif; background-color:#f4f6f8; padding:20px;">
  <div style="max-width:600px; margin:auto; background:#ffffff; padding:20px; border-radius:8px;">
    
    <h2 style="color:#2c3e50;">${event.title}</h2>

    <p><strong>Description:</strong> ${event.description}</p>

    <hr />

    <p><strong>📅 Date:</strong> ${new Date(event.eventDate).toDateString()}</p>
    <p><strong>📍 Campus:</strong> ${event.campus}</p>
    <p><strong>🏛 Venue:</strong> ${event.venue}</p>
    <p><strong>💻 Mode:</strong> ${event.mode}</p>
    <p><strong>🏷 Type:</strong> ${event.type}</p>
    <p><strong>🎯 Target Audience:</strong> ${event.targetAudience}</p>
    <p><strong>🧑‍💼 Organizer:</strong> ${event.organizer}</p>

    <hr />

    <p>
      <strong>🔗 Event Link:</strong><br/>
      <a href="${event.eventUrl}" target="_blank">${event.eventUrl}</a>
    </p>

    <br />

    <p style="font-size:14px; color:#555;">
      Sent by <strong>${fromUser.name || "Admin"}</strong><br/>
      ${fromUser.email}
    </p>

  </div>
</body>
</html>
`;
