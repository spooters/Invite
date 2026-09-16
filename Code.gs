/**
 * Hayley & Marcus — RSVP relay
 *
 * Receives RSVP form submissions from the wedding website, emails a
 * formatted summary to the couple, and logs each response as a new
 * row in a Google Sheet.
 *
 * SETUP — see the README for the full walkthrough. In short:
 *   1. Set TO_EMAIL below to the address that should receive RSVPs.
 *      >>> Fill this in with whatever real address your CURRENTLY LIVE
 *          deployment (the one at .../AKfycbyfTw1i.../exec) already
 *          uses — this file was reconstructed after the original
 *          source got deleted from git, so this value is a placeholder.
 *   2. Set SHEET_ID below to the ID of your Google Sheet, if you use one.
 *      >>> Same note as above — fill in your real Sheet ID if you have one.
 *   3. Deploy this project as a Web App (Execute as: Me,
 *      Who has access: Anyone), and copy the resulting /exec URL
 *      into the website's <form action="..."> attribute.
 */

const TO_EMAIL = 'YOUR_EMAIL@example.com'; // <-- set to your real live address
const SHEET_ID = 'YOUR_SHEET_ID';          // <-- set to your real live Sheet ID, or leave as-is to skip Sheet logging

// This deployment has to be "Anyone can access" so guests don't need a
// Google account to RSVP — but that also means anyone who finds this /exec
// URL (bots scan the web for open Apps Script endpoints, and it's visible
// in your public GitHub repo's index.html) can POST to it directly,
// bypassing the site entirely. FORM_TOKEN is a shared secret baked into a
// hidden field on the real form: genuine submissions carry it, blind spam
// bots posting generic payloads never will. It's not a secret from anyone
// who views your page source — it just filters out the "spray junk at
// every form endpoint we find" bots. Change this string (and the matching
// value in index.html) any time you want to invalidate anything that may
// have leaked.
const FORM_TOKEN = 'hm2027-925b60d0c21438de5321c9c0';

// Site-wide throttle. Apps Script doesn't expose the caller's IP, so this
// can't be per-visitor — but real wedding RSVP traffic will never come
// close to this, and it stops a flood from burning through your ~100
// emails/day Gmail quota.
const WINDOW_SECONDS = 300; // 5 minutes
const MAX_PER_WINDOW = 8;

function doPost(e) {
  try {
    const p = e.parameter || {};

    // --- Honeypot: a field real guests never see or fill in. Only a bot
    // that fills every input on the page (rather than blindly POSTing a
    // fixed payload) would trip this. ---
    if (String(p.company || '').trim() !== '') {
      return jsonOutput({ result: 'success' }); // pretend success, do nothing
    }

    // --- Shared token: rejects blind/generic spam POSTs outright ---
    if (p.form_key !== FORM_TOKEN) {
      return jsonOutput({ result: 'error', message: 'Invalid submission.' });
    }

    // --- Rate limit ---
    if (isRateLimited()) {
      return jsonOutput({ result: 'error', message: 'Too many submissions right now — please try again shortly.' });
    }

    // --- Basic validation — reject anything that isn't shaped like a real submission ---
    const name = clean(p.name, 200);
    const email = clean(p.email, 200);
    const attending = p.attending;
    const guestType = clean(p.guest_type, 50);
    const summary = clean(p.summary, 5000);

    if (!name || !isValidEmail(email) || ['Joyfully accepts', 'Regretfully declines'].indexOf(attending) === -1) {
      return jsonOutput({ result: 'error', message: 'Please fill in the form correctly.' });
    }

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
      // safeCell guards against formula injection (a cell starting with
      // =, +, -, or @ can execute as a formula if the sheet is opened or
      // exported to Excel/CSV).
      sheet.appendRow([new Date(), safeCell(name), safeCell(email), safeCell(attending), safeCell(guestType), safeCell(summary)]);
    }

    return jsonOutput({ result: 'success' });

  } catch (err) {
    return jsonOutput({ result: 'error', message: String(err) });
  }
}

function jsonOutput(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}

function clean(value, maxLen) {
  return String(value || '').trim().slice(0, maxLen);
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 200;
}

function safeCell(value) {
  const v = String(value || '');
  return /^[=+\-@]/.test(v) ? "'" + v : v;
}

function isRateLimited() {
  const cache = CacheService.getScriptCache();
  const key = 'rsvp_count';
  const current = Number(cache.get(key) || '0');
  if (current >= MAX_PER_WINDOW) return true;
  cache.put(key, String(current + 1), WINDOW_SECONDS);
  return false;
}

/**
 * Optional: open this project in the Apps Script editor and run this
 * function once (Run ▸ testDoPost) to send yourself a sample email
 * and sheet row without needing the live website.
 */
function testDoPost() {
  doPost({
    parameter: {
      form_key: FORM_TOKEN,
      name: 'Test Guest',
      email: 'test@example.com',
      attending: 'Joyfully accepts',
      guest_type: 'Day & Evening',
      summary: 'This is a test submission from the Apps Script editor.'
    }
  });
}
