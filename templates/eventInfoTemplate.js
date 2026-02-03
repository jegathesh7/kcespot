module.exports = (event, fromUser) => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${event.title}</title>
</head>

<body style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, Helvetica, sans-serif;">
  
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:30px 0;">
    <tr>
      <td align="center">

        <table width="600" cellpadding="0" cellspacing="0"
               style="background:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);">

          <!-- HEADER -->
          <tr>
            <td style="background:#1f2937; padding:20px 24px;">
              <h2 style="margin:0; color:#ffffff; font-size:22px;">
                ${event.title}
              </h2>
            </td>
          </tr>

          <!-- EVENT IMAGE -->
          <tr>
            <td style="padding:0;">
              <img
                src="cid:eventimage"
                alt="Event Poster"
                style="width:100%; max-height:280px; object-fit:cover; display:block;"
              />
            </td>
          </tr>

          <!-- CONTENT -->
          <tr>
            <td style="padding:24px; color:#374151; font-size:14px; line-height:1.6;">

              ${event.description}

              <table width="100%" cellpadding="0" cellspacing="0" style="margin:20px 0;">
                <tr>
                  <td width="35%" style="font-weight:600; padding:6px 0;">Date</td>
                  <td width="65%" style="padding:6px 0;">
                    ${new Date(event.eventDate).toDateString()}
                  </td>
                </tr>
                <tr>
                  <td style="font-weight:600; padding:6px 0;">Campus</td>
                  <td style="padding:6px 0;">${event.campus}</td>
                </tr>
                <tr>
                  <td style="font-weight:600; padding:6px 0;">Venue</td>
                  <td style="padding:6px 0;">${event.venue}</td>
                </tr>
                <tr>
                  <td style="font-weight:600; padding:6px 0;">Mode</td>
                  <td style="padding:6px 0;">${event.mode}</td>
                </tr>
                <tr>
                  <td style="font-weight:600; padding:6px 0;">Type</td>
                  <td style="padding:6px 0;">${event.type}</td>
                </tr>
                <tr>
                  <td style="font-weight:600; padding:6px 0;">Target Audience</td>
                  <td style="padding:6px 0;">${event.targetAudience}</td>
                </tr>
                <tr>
                  <td style="font-weight:600; padding:6px 0;">Organizer</td>
                  <td style="padding:6px 0;">${event.organizer}</td>
                </tr>
              </table>

              <!-- CTA -->
              <div style="text-align:center; margin:30px 0;">
                <a href="${event.eventUrl}" target="_blank"
                   style="background:#2563eb; color:#ffffff; text-decoration:none;
                          padding:12px 28px; border-radius:6px;
                          font-size:14px; font-weight:600;">
                  View Event Details
                </a>
              </div>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#f9fafb; padding:16px 24px; font-size:12px; color:#6b7280;">
              <p style="margin:0;">
                Sent by <strong>${fromUser.name || "Admin"}</strong>
              </p>
              <p style="margin:4px 0 0;">
                ${fromUser.email}
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;
