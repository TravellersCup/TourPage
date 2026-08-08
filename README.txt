THE TRAVELLERS TOUR — LIVE ONLINE ADMIN VERSION

WHAT CHANGED
- Admin password is no longer stored in browser JavaScript.
- Login is checked by a Netlify Function using environment variables.
- An HttpOnly secure session cookie is created after successful login.
- Tour data is stored in Netlify Blobs and public pages fetch the latest version.
- Saves use strong consistency so updates become visible to public visitors immediately after save.
- Player cards are clickable and open editable full player profiles.
- Event Records has its own public page and Admin can add/delete record title + description.
- Tour News supports a preview, full article and article photo.
- Uploaded photos and graphics are stored online in Netlify Blobs.

DEPLOYING TO NETLIFY
This version uses Netlify Functions + Blobs. Use GitHub-connected deploy or Netlify CLI, rather than only a simple static drag-and-drop.

1. Upload this project to a GitHub repository.
2. In Netlify choose Add new project > Import an existing project, then choose that repo.
3. Netlify should read netlify.toml automatically. No build command is needed; publish directory is the project root.
4. In Netlify go to Project configuration > Environment variables and add:
   ADMIN_PASSWORD = 5238
   ADMIN_SESSION_SECRET = loNMYhj5fYedKl9biSUK0Vr9HEpgIoAwJ6aXHlO53s0
   Mark both as secret values if offered.
5. Deploy.
6. Visit /admin.html and enter 5238.
7. Make an edit, save it, then open the public site on another browser/device to confirm it is live.

SECURITY
- For stronger protection, change 5238 to a longer password before sharing widely.
- Never paste ADMIN_PASSWORD or ADMIN_SESSION_SECRET into HTML or browser JavaScript.
