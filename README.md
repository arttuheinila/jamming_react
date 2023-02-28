With the Jamming React -app you can search and add your favorite songs from Spotify and create playlists.
	Use yourself or share to others without giving them access to your personal spotify account

1. Download files to your local drive

2. In the project directory, you can run:

3. You need to create a spotify integration by going to https://developer.spotify.com/dashboard/login and logging in

4. Create an app and copy the client ID to
	module: src/util/Spotify.js
	const clientId = 'INSERT YOUR ID'

5. Press "Edit settings" in your app and insert http://localhost:3000 to your Redirect URIs

6. Now you can launch your app in terminal by going to the app directory and typing 'npm start'
	This runs the app in the development mode.\
	Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

Required packages:
*npm
*node