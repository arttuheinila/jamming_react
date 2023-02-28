//Add your own clientId from Spotify at https://developer.spotify.com/dashboard/login
const clientId = '';

if (clientId ==='') {
    alert('You need to insert your personal clientId in the src/util/Spotify.js')
}

const redirectUri = 'http://localhost:3000'

let accessToken;

const Spotify = {
    getAccessToken() {
        if (accessToken) {
            return accessToken;
        }
        // check for access token match
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/);
        const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/)     

        if (accessTokenMatch && expiresInMatch) {
            accessToken = accessTokenMatch[1];
            const expiresIn = Number(expiresInMatch[1]);
            
            //This clears the parameters from the URL, so the app doesn't try grabbing the acess token after it has expired

            window.setTimeout(()=> accessToken = '', expiresIn * 1000);
            window.history.pushState('accessToken', null, '/');
            return accessToken;
        } else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
            window.location = accessUrl;
        }   
    },
    
      search(searchItem) {
        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}`};
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${searchItem}`, 
            { headers: headers }
            ).then(response => {
                // converting response to json 
                return response.json()
            }).then(jsonResponse => {
                if (!jsonResponse.tracks) /* checks if there are no tracks */ {
                    return [];
                } /* else it will convert json to an array of tracks */
                return jsonResponse.tracks.items.map(track => ({
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri
                }));
            });
    },


    savePlaylist(name, trackUris) {
        if (!name || !trackUris.length) {
            return;
        }

        const accessToken = Spotify.getAccessToken();
        const headers = { Authorization: `Bearer ${accessToken}`}
        let userId;

        return fetch('https://api.spotify.com/v1/me', { headers: headers }
        ).then(response => response.json()
        ).then(jsonResponse => {
            userId = jsonResponse.id
            return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                headers: headers,
                method: 'POST',
                body: JSON.stringify({ name: name})
            }). then(response => response.json()
            ).then(jsonResponse => {
                const playlistId = jsonResponse.id
                fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
                    headers: headers,
                    method: 'POST',
                    body: JSON.stringify({uris: trackUris})
                })
            })
        })
    }
}

export default Spotify