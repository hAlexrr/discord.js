const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config()

// getAllSteamGames('Counter Strike')

module.exports = {
    getAllSteamGames,
    getSteamGameData,
    getSteamGamesData,
    getCurrentGamePlayers,
}

async function getCurrentGamePlayers(appId){
    return axios('GET https://api.steampowered.com/ISteamUserStats/GetNumberOfCurrentPlayers/v1/?appid=' + appId)
    .then(response => {
        return response.data.response.player_count
    })
    .catch(error => {
        console.log(error)
    })
}

async function getSteamGamesData(gameName){
    const getListOfSteamGames = await getAllSteamGames(gameName)
    
    const getDataForGames = await Promise.all(getListOfSteamGames.map(async game => {
        const data = await getSteamGameData(game.appid)
        return data
    }))
    return getDataForGames    
}

async function getSteamGameData(appId){
    return axios('https://store.steampowered.com/api/appdetails?appids=' + appId)
    .then(response => {
        return response.data[appId].data
    })
    .catch(error => {
        console.log(error)
    })
}

async function getAllSteamGames(gameName) {
    return axios('https://api.steampowered.com/ISteamApps/GetAppList/v2/')
    .then(response => {
        games = response.data.applist.apps
        filteredGames = games.filter(game => game.name.toLowerCase().replace(/[^a-zA-Z0-9 ]/gi, ' ').replace(/\s+/g, ' ').includes(gameName.toLowerCase()))

        // filteredGames.forEach(game => {
        //     game.name = game.name.replace(/[^a-zA-Z0-9 ]/gi, ' ').replace(/\s+/g, ' ').trim()
        // })

        console.log(filteredGames)
        return filteredGames
    })
    .catch(error => {
        console.log(error)
    })
}
