const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder} = require('discord.js');

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
        .setDescription('Initiates a vote to mute a user for a specified amount of time.')
        .addUserOption(option => 
            option.setName('target')
                .setDescription('Select a user to mute.'))
        .setDefaultMemberPermissions(PermissionFlagsBits.MoveMembers | PermissionFlagsBits.MuteMembers),

    async execute(interaction) {
        const user = interaction.options.getUser('target');
        
        //Generate a random number from 1 to 60
        const randomNumber = Math.floor(Math.random() * 60) + 1;
        const seconds = 60

        console.log(interaction)

        // console.log(user)

        // Grab id from users variable
        const userId = user.id;

        //Checking if user is in a voice channel
        const userCheck = interaction.guild.members.cache.get(userId);
        if(!userCheck.voice.channel) {
            interaction.reply(`${user} is not in a voice channel at this time. Vote will not be initiated.`);
            return;
        }   

        const embed = new EmbedBuilder()
            .setColor('#00ff00')
            .setTitle('Vote to mute ' + user.username)
            .setDescription('A vote to mute ' + user.username + ' for ' + randomNumber + ' minutes has been started.\n' +
            `${response[Math.floor(Math.random() * response.length)]} ${ascii_faces[2][Math.floor(Math.random() * ascii_faces[2].length)]}`)

       const message =  await interaction.reply({
            content: seconds + 's left to vote',
            embeds: [embed],
            fetchReply: true
        })
        
        message.react('👍').then(() => message.react('👎'));

		const filter = (reaction, user) => {
			return ['👍', '👎'].includes(reaction.emoji.name) && user.id !== message.author.id && interaction.guild.members.cache.get(user.id).voice.channel;
		};

        const collector = message.createReactionCollector({filter,  time: seconds * 1000 });

        collector.on('collect', (reaction, user) => {
            console.log(`Collected ${reaction.emoji.name} from ${user.username}`);
        });

        collector.on('end', collected => {
            console.log(`Collected ${collected.size} items`);
        })

    }

}