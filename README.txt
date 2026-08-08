THE TRAVELLERS TOUR — LIVE ONLINE ADMIN VERSION

WHAT CHANGED
- Admin password is checked by a Netlify Function using environment variables.
- Admin credentials are NOT stored in this repository.
- An HttpOnly secure session cookie is created after successful login.
- Tour data is stored in Netlify Blobs and public pages fetch the latest version.
- Player cards open full player profiles.
- Event Records, Tour News, Gallery and Shop are editable from Admin.

DEPLOYING TO NETLIFY
1. Upload this project to GitHub.
2. In Netlify choose Add new project > Import an existing project.
3. Netlify reads netlify.toml automatically. No build command is needed.
4. In Netlify > Project configuration > Environment variables, create these keys:
   ADMIN_PASSWORD
   ADMIN_SESSION_SECRET
5. Enter their VALUES ONLY in Netlify. Do not put the values in GitHub, README files, HTML, JavaScript, or netlify.toml.
6. Mark them as secret values when available.
7. Redeploy after setting or changing the environment variables.
8. Visit /admin.html and sign in using the password you configured in Netlify.

SECURITY
- Use a strong password rather than a short PIN for a public site.
- ADMIN_SESSION_SECRET should be a long random value.
- If a password or session secret was previously committed to GitHub, change/rotate it in Netlify before redeploying.
