# Hayley & Marcus — Wedding Site

A minimal, static wedding website mirroring the printed invitation, with an RSVP form that collects attendance and meal choices.

## Before you publish

1. **Connect the RSVP form (Google Apps Script — free, no billing tier)**

   This form posts to a small script you deploy under your own free Google account. It emails you a formatted RSVP summary and (optionally) logs every response as a row in a Google Sheet. No third-party company, no account signup beyond Google, no submission caps that turn into a bill.

   - **Create a Sheet (optional but recommended):** go to [sheets.google.com](https://sheets.google.com), create a blank sheet named e.g. "Wedding RSVPs." Copy its ID from the URL — the long string between `/d/` and `/edit`.
   - **Create the script:** go to [script.google.com](https://script.google.com) → New project. Delete the placeholder code and paste in the contents of `google-apps-script/Code.gs` from this folder.
   - **Configure it:** at the top of the script, set `TO_EMAIL` to your real email address, and `SHEET_ID` to the ID you copied (or leave as-is to skip the Sheet and only get emails).
   - **Deploy it:** click **Deploy → New deployment → Web app**. Set "Execute as" to yourself, and "Who has access" to "Anyone" (this must be public so the site can reach it without guests logging in). Click Deploy.
   - **Approve permissions:** the first deploy shows an "unverified app" warning — this is normal for your own script. Click **Advanced → Go to project (unsafe) → Allow**. You're authorizing your own script to send email from your own account.
   - **Copy the URL:** deployment gives you a URL ending in `/exec`. Open `index.html`, find `action="https://script.google.com/macros/s/YOUR_SCRIPT_URL/exec"` on the `<form>` tag, and replace it with your real URL.
   - **Test it:** in the Apps Script editor, you can select the `testDoPost` function from the dropdown and click Run to send yourself a sample email/row without touching the live site.

   *Quota note:* personal Gmail accounts can send roughly 100 emails/day via Apps Script — far more than a wedding guest list needs, and it never converts into a bill; it just pauses until the next day if you somehow exceeded it.

2. **Double-check the details** in `index.html`: venue address, map link, RSVP deadline, and menu items, in case anything changes.

3. **Update the Google Maps link** if needed — search the venue name on Google Maps, copy the share link, and swap it into the `href` on the Venue card.

## Hosting on GitHub Pages

1. Create a new GitHub repository (e.g. `hayley-and-marcus-wedding`).
2. Push these files (`index.html`, `style.css`, `assets/`) to the repository root.
3. In the repo, go to **Settings → Pages**.
4. Under **Build and deployment**, set **Source** to `Deploy from a branch`, branch `main`, folder `/ (root)`.
5. Save — GitHub will publish the site at `https://<your-username>.github.io/<repo-name>/` within a minute or two.

## File structure

```
index.html          the page
style.css            all styling
assets/
  floral-crop.jpg     hydrangea artwork, cropped from the invitation
  hills-crop.jpg      hillside artwork, cropped from the invitation
  favicon.png          browser tab icon
google-apps-script/
  Code.gs              the RSVP relay script — paste into script.google.com
```

## Notes

- No build tools or frameworks — plain HTML/CSS/JS, so it loads fast and works on GitHub Pages with zero configuration.
- The RSVP form gracefully hides the meal-choice fields if a guest selects "Regretfully declines."
- Fonts are loaded from Google Fonts (`Mrs Saint Delafield` for the script, `Cormorant Garamond` for body text) — both free to use.
