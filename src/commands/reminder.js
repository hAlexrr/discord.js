const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('reminder')
        .setDescription('Sets a reminder for the user to respond to.')
        .addStringOption(option =>
            option.setName('reminder')
                .setDescription('The name of the reminder')
        )
        .addIntegerOption(option =>
            option.setName('time')
                .setDescription('The time in minutes before the reminder is sent')
        ),

        execute(interaction) {
            const reminder = interaction.options.getString('reminder');
            const time = interaction.options.getInteger('time');

            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() })
                .setTitle(`Reminder: ${reminder}`)
                .setDescription(`This reminder will be sent in ${time} minutes.`)

            interaction.reply( {
                content: '',
                embeds: [embed],
                fetchReply: true
            })

            setTimeout(() => {
                interaction.followUp(`${interaction.user} this is your reminder for ${reminder}`);
            }, time * 60 * 1000)
        }
}