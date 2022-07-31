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
                .setDescription('Select a user to cast a vote to timeout.'))
        .setDefaultMemberPermissions(PermissionFlagsBits.MoveMembers | PermissionFlagsBits.MuteMembers),

    async execute(interaction) {
        const user = interaction.options.getUser('target');
        const member = interaction.options.getMember('target')
        const roles = member.roles
        const pfp = user.avatarURL()

        let yesVotes = 0;
        let totalVotes = 0;
        
        //Generate a random number from 1 to 60
        const randomNumber = Math.floor(Math.random() * 2) + 1;
        const seconds = 5

        if(user.id == interaction.user.id){
            interaction.reply('You cannot vote to timeout yourself.', )
            util.deleteReply(interaction)
            return;
        }

        // Checking if user is in a voice channel
        if(!util.userInVoiceChannel(interaction, user.id)) {
            interaction.reply(`${user} is not in a voice channel at this time. Vote will not be initiated.`);
            util.deleteReply(interaction)
            return;
        } 
        
        //Check if user and message author are in the same voice channel
        if(util.getUserVoiceChannel(interaction, user.id) !== util.getUserVoiceChannel(interaction, interaction.user.id)) {
            interaction.reply(`${user} is not in the same voice channel as you. Vote will not be initiated.`);
            util.deleteReply(interaction)
            return;
        }

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

        //Get the users cached data
        const serverRoles = util.getAllRoles(message)
        const rolesCache = util.cacheAllUsersRoles(roles, serverRoles)
        const cacheChannel = util.getUserVoiceChannel(interaction, user.id)

        collector.on('collect', (reaction, user) => {
            if(reaction.emoji.name === '👍') {
                yesVotes++;
            }
            totalVotes++;
            console.log(`Collected ${reaction.emoji.name} from ${user.username}`);
        });

        collector.on('end', collected => {

            console.log(`Collected all reactions from users. Yes: ${yesVotes} No: ${totalVotes - yesVotes}`);
            
            //If more than half of the votes are yes, timeout the user
            if( yesVotes / totalVotes >= 0.75){

                interaction.followUp(`Vote was successful for ${user} to be muted for ${randomNumber} minutes. ${yesVotes} / ${totalVotes} votes`);

                // // Check if user is in role_timeout
                // if(util.userHasRole(roles, role_timeout)){
                //     roles.remove(role_timeout)
                // }

                //Remove all roles from user, and cache roles before adding role_timeout to user
                setTimeout(() => {
                    util.removeAllUsersRoles(roles, serverRoles)
                }, 1000);
                

                //Move user to timeout channel, and cache current channel
                setTimeout(() => {
                    util.moveUserToChannel(interaction, user.id, timeout_channel)  
                }, 3000);
                
                //Add role_timeout to user
                setTimeout(() => {
                    util.setTimeoutRole(roles, role_timeout)
                }, 1500);

                setTimeout(() => {
                    //setTimeout Remove role_timeout from user 5ms after timeout
                    setTimeout(() => {
                        util.removeTimeoutRole(roles, role_timeout)
                    }, 1000)

                    //Move user back to original channel, and give user all roles from cache
                    setTimeout(() => {               
                        util.addUserRoles(roles, rolesCache)
                    }, 1500)

                    setTimeout(() => {
                        util.moveUserToChannel(interaction, user.id, cacheChannel)
                    }, 3000)

                    interaction.followUp(`${user} timeout has finished.`)

                }, randomNumber * 60* 1000);
            } else {
                interaction.followUp(`Vote was unsuccessful for ${user} to be muted for ${randomNumber} minutes. ${yesVotes} / ${collected.size} votes`);
                console.log('Vote was unsuccessful. ${yesVotes} / ${collected.size} votes')
            }
        })
    }
}