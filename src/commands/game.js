const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getAllSteamGames, getSteamGameData, getCurrentGamePlayers } = require('../util/steam');
const { blankEmbedLine, getRandomMeme } = require('../util/utility');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('game')
        .setDescription('Gets the game data for a game.  (Currently only for steam) ')
        .addStringOption(option =>
            option.setName('name')
                .setDescription('The game you want to get the data for')
        ),
    async execute(interaction) {
        const gameName = interaction.options.getString('name');

        const getListOfSteamGames = await getAllSteamGames(gameName)

        const getDataForGames = await Promise.all(getListOfSteamGames.map(async game => {
            const data = await getSteamGameData(game.appid)
            const playerCount = await getCurrentGamePlayers(game.appid)
            if( data.type !== 'game'){
                return null
            }
            return {data, playerCount}
        }))

        console.log(getDataForGames.data.length)

        const gameData = getDataForGames.data
        const playerCount = getDataForGames.playerCount

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setTitle(`${gameData.name}`)
            .setDescription(`https://store.steampowered.com/app/${gameData.appid}`)
            .addFields(
                { name: 'Release Date', value: gameData.release_date.date, inline: true },
                { name: 'Price', value: gameData.is_free == false ? gameData.price_overview.final_formatted : 'Free', inline: true },
                { name: 'Recommendations', value: gameData.recommendations.total, inline: true },
                blankEmbedLine(),                
                )
                .setFooter( { text: `${playerCount} players` } )
            
        try{
            embed.setThumbnail(gameData.header_image)
        } catch(e){
            embed.setThumbnail(getRandomMeme())
            console.log(e)
        }

        console.log(getDataForGames.length)
    }
}