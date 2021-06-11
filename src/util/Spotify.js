import SearchBar from "../Components/SearchBar/SearchBar";

let userAccessToken;
let appClientId = process.env.REACT_APP_APP_CLIENT_ID
let redirectedURI = 'https://auralify.surge.sh/'

const Spotify = {
    getAccessToken() {
        if(userAccessToken) {
            return userAccessToken;
        }
        //Attempts to match an access token in the `window` object.
        const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/)
        const expirationMatch = window.location.href.match(/expires_in=([^&]*)/)
        if(accessTokenMatch && expirationMatch) {
            userAccessToken = accessTokenMatch[1]
            let tokenExpiresIn = Number(expirationMatch[1])
            //The parameters are cleared in order to grab a new access token when the previous one expires
            window.setTimeout(() => userAccessToken = '', tokenExpiresIn * 1000);
            window.history.pushState('Access Token', null, '/');
            return userAccessToken;
        } else {
            const redirectedTo = `https://accounts.spotify.com/authorize?client_id=${appClientId}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectedURI}`
            window.location = redirectedTo;
        }
    },

    search(input) {
        let accessToken = Spotify.getAccessToken();
        return fetch(`https://api.spotify.com/v1/search?type=track&q=${input}`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        }).then(response => {
            return response.json()
        }).then(jsonResponse => {
            if(!jsonResponse.tracks) {
                return []
            } else {
                return jsonResponse.tracks.items.map(track => ({
                    id: track.id,
                    name: track.name,
                    artist: track.artists[0].name,
                    album: track.album.name,
                    uri: track.uri
                }))
            }
        })
    },

    savePlayList(name, trackURIs) {
        if(!name || !trackURIs) {
            return;
        }

        let accessToken = Spotify.getAccessToken();
        let headers = {
            Authorization: `Bearer ${accessToken}`
        }
        let userId;

        return fetch(`https://api.spotify.com/v1/me`,
         { headers: headers }).then(
            response => response.json()
         ).then(
             jsonResponse => {
                 userId = jsonResponse.id
                 return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
                     headers: headers,
                     method: 'POST',
                     body: JSON.stringify({ name: name })
                 }).then(
                     response => response.json()
                 ).then(
                     jsonResponse => {
                         const playlistID = jsonResponse.id
                         return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistID}/tracks`, {
                            headers: headers,
                            method: 'POST',
                            body: JSON.stringify({ uris: trackURIs })
                         })
                     }
                 )
             }
         )
    }

}

export default Spotify;