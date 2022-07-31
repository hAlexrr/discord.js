const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder} = require('discord.js');
const util = require('../util/utility');

const role_timeout = '1002867030904541225'
const timeout_channel = '1002867683995439114'

const response = [
    'GLHF',
    'Good luck',
    'Don\'t cry',
    'Bribe the government',
    'Don\'t be an asshole',
]

const ascii_faces = [
    [
        'ಠﭛಠ',
        'ಠ_ಠ',
        "Ψ (‘益’)↝"
    ],
    [
        't(-_-t)',
        '(ಠ_ಠ)┌∩┐',
    ],
    [
        '¯\_(ツ)_/¯',
        '¯\_( ͡° ͜ʖ ͡°)_/¯',
        'へ‿(ツ)‿ㄏ',
        'ლ(ﾟдﾟლ)',
        'ლ(ಠ益ಠ)ლ',
        'ლ(ಠ益ಠლ)',
        'ლ(ಠ益ಠ)',
        'ʅ（´◔౪◔）ʃ',
        'ʅ（´･ᴛ･）ʃ',
        't(ツ)_/¯'
    ]

]

module.exports = {
    data: new SlashCommandBuilder()
        .setName('votetimeout')
        .setDescription('Initiates a vote to timeout a user for a randomized amount of time.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('Select a user to cast a vote to timeout.')),

    async execute(interaction) {
        // Create vote mute function
        const user = interaction.options.getUser('target');
        const member = interaction.options.getMember('target')

        let yesVotes = 0;
        let totalVotes = 0;

        const voiceChannel = util.getUserVoiceChannel(interaction, user.id)

        // Generate a random number from 1 to 60
        const randomNumber = Math.floor(Math.random() * 2) + 1;
        const seconds = 5

        // Create a new embed
        const embed = new EmbedBuilder()
            .setTitle('Vote to mute (${seconds} seconds) ')
            .setDescription(`React with ✅ to vote to mute ${user} or ❌ to vote to not mute ${user}.`)
            .setColor('#0099ff')
            .setTimestamp()
            .setFooter('Vote to mute', user.avatarURL())
            .setThumbnail(user.avatarURL())
            .addField(
                { name: 'User to mute', value: `${user}`, inline: true },
                { name: 'User who casted the vote', value: `${interaction.user}`, inline: true },
                { name: 'Voice Channel', voiceChannel, inline: true },
                { name: 'Time of mute (in minutes)', value: `${randomNumber}`, inline: true }
            )
        
        const message = await interaction.reply({
            embeds: [embed],
            ephemeral: true,
            fetchReply: true
        })

        // Add the vote to the message
        message.react('✅')
        .then(() => 
            message.react('❌')
        )

        // Create a filter for the reactions
        const filter = (reaction, user) => {
			return ['✅', '❌'].includes(reaction.emoji.name) && user.id !== message.author.id && util.userInVoiceChannel(interaction, user.id);
		};

        // Create a new reaction collector
        const collector = message.createReactionCollector({ filter, time: seconds * 1000 });

        // Add a listener for the collector
        collector.on('collect', (reaction, user) => {
            if(reaction.emoji.name === '✅') {
                yesVotes++;
            }
            totalVotes++;
            console.log(`Collected ${reaction.emoji.name} from ${user.username}`);
        })

        // Add a listener for the collector
        collector.on('end', (collected) => {
            console.log(`Collected all reactions from users. Yes: ${yesVotes} No: ${totalVotes - yesVotes}`);
            
            //If more than half of the votes are yes, timeout the user
            if( yesVotes / totalVotes >= 0.75){
                interaction.followUp(`Vote was successful for ${user} to be muted for ${randomNumber} minutes. ${yesVotes} / ${totalVotes} votes`);

                // Mute the user for the random number of minutes
                
            }
        })

    }
}