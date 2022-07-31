const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config()

baseURL = 'https://api.genius.com/'

module.exports = { 
    getLyricsForSong(searchTerm) {
        url = baseURL + 'search?' + process.env.GENIUS_ACCESS_TOKEN + 'q=' + encodeURIComponent(searchTerm);

        const promise = axios(url);

        const dataPromise = promise.then(response => response.data )

        const songPromise = dataPromise.then(data => data.response.hits[0].result.id)

        const lyricsPromise = songPromise.then(songId => axios(baseURL + 'songs/' + songId + '?' + process.env.GENIUS_ACCESS_TOKEN))

        return lyricsPromise.then(response => response.data)
    }
}

