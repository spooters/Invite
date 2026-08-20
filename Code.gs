/**
 * Hayley & Marcus — RSVP relay
 *
 * Receives RSVP form submissions from the wedding website, emails a
 * formatted summary to the couple, and logs each response as a new
 * row in a Google Sheet.
 *
 * SETUP — see the README for the full walkthrough. In short:
 *   1. Set TO_EMAIL below to the address that should receive RSVPs.
 *   2. Set SHEET_ID below to the ID of your Google Sheet (the long
 *      string in the sheet's URL between /d/ and /edit).
 *   3. Deploy this project as a Web App (Execute as: Me,
 *      Who has access: Anyone), and copy the resulting /exec URL
 *      into the website's <form action="..."> attribute.
 */

const TO_EMAIL = 'YOUR_EMAIL@example.com';
const SHEET_ID = 'YOUR_SHEET_ID';

function doPost(e) {
  try {
    const p = e.parameter || {};

    const name = p.name || '(no name given)';
    const email = p.email || '';
    const attending = p.attending || '';
    const guestType = p.guest_type || '';
    const summary = p.summary || '';

    // --- Email the couple ---
    const subject = 'Wedding RSVP — ' + name;
    const body = summary || 'No details submitted.';
    MailApp.sendEmail({
      to: TO_EMAIL,
      subject: subject,
      body: body,
      replyTo: email || undefined
    });

    // --- Log to the Sheet ---
    if (SHEET_ID && SHEET_ID !== 'YOUR_SHEET_ID') {
      const sheet = SpreadsheetApp.openById(SHEET_ID).getActiveSheet();
      if (sheet.getLastRow() === 0) {
        sheet.appendRow(['Timestamp', 'Name', 'Email', 'Attending', 'Guest Type', 'Summary']);
      }
      sheet.appendRow([new Date(), name, email, attending, guestType, summary]);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ result: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ result: 'error', message: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Optional: open this project in the Apps Script editor and run this
 * function once (Run ▸ testDoPost) to send yourself a sample email
 * and sheet row without needing the live website.
 */
function testDoPost() {
  doPost({
    parameter: {
      name: 'Test Guest',
      email: 'test@example.com',
      attending: 'Joyfully accepts',
      guest_type: 'Day & Evening',
      summary: 'This is a test submission from the Apps Script editor.'
    }
  });
}
