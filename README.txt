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


ADMIN UPDATE — MANAGE NEWS + SHOP
This version adds Manage Tour News and Manage Tour Shop sections. Existing live Netlify Blob data is NOT reset by deploying these files. You can edit/delete existing articles and shop products, and replacing an image is optional.


PLAYER PORTAL UPDATE
The player portal adds attendance, personal stats, profile editing, What's in the Bag, voting polls and digital membership cards. Attendance responses appear publicly on the Tournaments page. Admin can create/edit/delete polls and manage member IDs, member-since, status, card level, linked player and portal passwords.

INITIAL PORTAL ACCOUNTS
Four usernames are preconfigured in the code: KAI, FLETCHER, XAVIER and ANDRE. Their password VALUES must NOT be committed to GitHub. Add the following environment-variable KEYS in Netlify and use SHA-256 hashes of the initial PINs (not the PINs themselves):
PLAYER_PASSWORD_HASH_KAI
PLAYER_PASSWORD_HASH_FLETCHER
PLAYER_PASSWORD_HASH_XAVIER
PLAYER_PASSWORD_HASH_ANDRE
Set them as secret environment variables for Production (and the other deploy contexts if you use them).

After a password is reset in the Admin dashboard, the reset password is stored as a salted scrypt hash in Netlify Blobs and overrides the initial environment-variable password.


IMPORTANT — HASHED INITIAL PLAYER PASSWORDS
To avoid Netlify secret scanning false positives on short numeric PINs, store only SHA-256 hashes in Netlify.
The members still type their original PINs into the portal.

Use these Netlify environment variables:
PLAYER_PASSWORD_HASH_KAI = f34eb9d345d7d40d2d2ebf903d2c29cc39efe8d52b2f909d58b6f02b5b6d5c82
PLAYER_PASSWORD_HASH_FLETCHER = cbe52a3141e613d876a31f903e8716973cca352e37b43fceb68089f5453870ad
PLAYER_PASSWORD_HASH_XAVIER = 7a5df5ffa0dec2228d90b8d0a0f1b0767b748b0a41314c123075b8289e4e053f
PLAYER_PASSWORD_HASH_ANDRE = 73a2af8864fc500fa49048bf3003776c19938f360e56bd03663866fb3087884a

These hash values are not passwords and do not reveal the PINs directly. They do not need to be marked as secret, but may be if you prefer.
