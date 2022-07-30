const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder} = require('discord.js');
const util = require('../util/utility');

const role_timeout = '1002867030904541225'

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
                .setDescription('Select a user to cast a vote to timeout.'))
        .setDefaultMemberPermissions(PermissionFlagsBits.MoveMembers | PermissionFlagsBits.MuteMembers),

    async execute(interaction) {
        const user = interaction.options.getUser('target');
        const roles = interaction.options.getMember('target').roles
        const pfp = user.avatarURL()
       
        let yesVotes = 0;
        let rolesCache = roles;
        
        //Generate a random number from 1 to 60
        const randomNumber = Math.floor(Math.random() * 2) + 1;
        const seconds = 5

       // console.log(interaction)

        // console.log(user)

        //Checking if user is in a voice channel
        // if(!util.userInVoiceChannel(interaction, user.id)) {
        //     interaction.reply(`${user} is not in a voice channel at this time. Vote will not be initiated.`);
        //     return;
        // }   

        const embed = new EmbedBuilder()
            .setColor('#00ff00')
            .setImage(pfp)
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
			return ['👍', '👎'].includes(reaction.emoji.name) && user.id !== message.author.id && util.userInVoiceChannel(interaction, user.id);
		};

        const collector = message.createReactionCollector({filter,  time: seconds * 1000 });

        collector.on('collect', (reaction, user) => {
            if(reaction.emoji.name === '👍') {
                yesVotes++;
            }
            console.log(`Collected ${reaction.emoji.name} from ${user.username}`);
        });

        // TODO - Implement removing all roles to user and setting role to timeout
        // TODO - Move member to timeout channel
        collector.on('end', collected => {

            console.log(`Collected all reactions from users. Yes: ${yesVotes} No: ${collected.size - yesVotes}`);
            
           if( yesVotes / collected.size >= 0.75){

                interaction.followUp(`Vote was successful for ${user.username} to be muted for ${randomNumber} minutes. ${yesVotes} / ${collected.size} votes`);
                // Remove all roles from user, and cache them, then add the role_timeout to the user.


                roles.cache.forEach(role => {
                    roles.remove(role.id)
                })
                
                roles.add(role_timeout)

                setTimeout(() => {
                    console.log('Removed timeout role for ' + user.username)
                    roles.remove(role_timeout)
                    rolesCache.forEach(role => {
                        roles.add(role.id)
                    })
                }, randomNumber * 60* 1000);
           }

        })

    }

}