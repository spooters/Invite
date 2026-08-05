# Hayley & Marcus — Wedding Site

A minimal, static wedding website mirroring the printed invitation, with an RSVP form that collects attendance and meal choices.

## Before you publish

1. **Connect the RSVP form (Formspree)**
   - Create a free account at [formspree.io](https://formspree.io).
   - Create a new form and copy its endpoint (looks like `https://formspree.io/f/abcd1234`).
   - Open `index.html`, find `action="https://formspree.io/f/YOUR_FORM_ID"` in the `<form>` tag, and replace `YOUR_FORM_ID` with your real ID.
   - Formspree will send a confirmation email the first time — click the link before sharing the site, or submissions won't be delivered.
   - Free tier allows 50 submissions/month, which is normally plenty for a wedding guest list. Upgrade if you expect more.

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
```

## Notes

- No build tools or frameworks — plain HTML/CSS/JS, so it loads fast and works on GitHub Pages with zero configuration.
- The RSVP form gracefully hides the meal-choice fields if a guest selects "Regretfully declines."
- Fonts are loaded from Google Fonts (`Mrs Saint Delafield` for the script, `Cormorant Garamond` for body text) — both free to use.
