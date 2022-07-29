const { SlashCommandBuilder } = require('discord.js');
const axios = require('axios');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ss')
        .setDescription('Gives the server status of a game')
        .addStringOption(option =>
            option.setName('game')
                .setDescription('The game you want to get the server status of')
                .setRequired(true)
                .addChoices(
                {name: 'valorant', value: 'valorant'},
                )
        ),
    async execute(interaction) {
        const game = interaction.options.getString('game');


        if(game === 'valorant') {
            axios('https://api.henrikdev.xyz/valorant/v1/status/na')
            .then(json => {
                server_status = "Online"
                if(json.status === '200'){
                    maintenance = json.maintenance
                    if(maintenance.length > 0){
                        server_status = "in Maintenance"
                    }

                    incidents = json.incidents;
                    if(incidents.length > 0){
                        server_status = "Incident"
                    }
                }
                color = "+"

                if (server_status !== "Online")
                    color = "-"

                interaction.reply(`\`\`\`diff\n${color} ${game.toUpperCase()} is currently ${server_status}.\n\`\`\``);
            })
            .catch(err => {
                console.log(err)
                interaction.reply('There was an error while getting the server status for game (valorant)')
            })
        }
    },
}