const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { getUserActivity, getUserVoiceChannel, deleteReply, getRandomMeme } = require('../util/utility');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('invite')
        .setDescription('Notifys members in the guild that you are inviting them to join.')
        .addIntegerOption(option =>
            option.setName('amount')
                .setDescription('The amount of players you need')
                ),
    
    async execute(interaction) {
        const amount = interaction.options.getInteger('amount');
        const member = interaction.guild.members.cache.get(interaction.user.id)

        let memeURL = ''

        const activity = getUserActivity(member);
        const voiceChannel = getUserVoiceChannel(interaction, interaction.user.id);

        if(activity.name === ''){
            interaction.reply('You are not playing anything at this time. Please play something before inviting people.');
            deleteReply(interaction);
            return;
        }

        console.log(activity)

        if(activity.assests == null)
            memeURL = await getRandomMeme();
        
        console.log(memeURL)

        const embed = new EmbedBuilder()
            .setColor('#0099ff')
            .setDescription(`Easy Room Join -> ${voiceChannel}\nEasy Member DM -> ${interaction.user}`)
            .addFields(
                {name: 'Game being played', value: activity.name.toUpperCase(), inline: true},
                {name: 'Players Asked', value: amount.toString(), inline: true},
                {name: 'Voice Channel', value: voiceChannel.name, inline: true},
                )
        try{
            embed.setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() })
            embed.setTitle(`Join ${interaction.user.username} to play ${activity.name.toUpperCase()}`)
            embed.setThumbnail( activity.assests !== null ? activity.assets.smallImageURL() : memeURL.url)
        } catch (e) {
            console.log(e)
        }

        interaction.reply( {
            content: '@everyone',
            embeds: [embed],
            fetchReply: true
        })
    }
}