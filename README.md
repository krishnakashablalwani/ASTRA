# <img src="favicon.png" alt="CampusHive Favicon" width="64" height="64" style="background: none;">
# CampusHive

**Buzzing with campus activity**

CampusHive is a centralized digital campus hub for events, announcements, club activities, and student engagement—all in one place.


## Deployment

### Deploying to GitHub

1. Push your code to a GitHub repository.
2. Make sure your backend and frontend folders are committed.

### Deploying to Render

1. Create a free account at https://render.com/.
2. Connect your GitHub repository to Render.
3. Create a new Web Service for the backend:
	- Select the backend folder as the root.
	- Set the build command: `npm install`
	- Set the start command: `npm start` or `node index.js`
	- Add environment variables (e.g., `MONGODB_URI`, `JWT_SECRET`).
4. (Optional) For the frontend, create a Static Site:
	- Select the frontend folder as the root.
	- Set the build command: `npm install && npm run build`
	- Set the publish directory: `build`
5. Update CORS and API URLs as needed for production.

For more details, see the backend and frontend README files.

- Krishna Kashab Lalwani — Team Leader
- Kaveti Sanjana — Team Member
- Mooli Tanvi Reddy — Team Member