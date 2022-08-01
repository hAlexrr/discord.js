const axios = require('axios');

module.exports = {
    userInVoiceChannel(interaction, userId) {      
        const userCheck = interaction.guild.members.cache.get(userId);

        if(!userCheck.voice.channel) 
            return false;
            
        return true;
    },

    getAllRoles(message) {
        const rolesList = message.guild.roles.cache.map(role => role.name);
        const roleIds = message.guild.roles.cache.map(role => role.id);
        return {list: rolesList, ids: roleIds};
    },

    userHasRole(roles, roleId) {
        if(!roles.cache.has(roleId))
            return false;
        return true;
    },

    rolesThatBreak() {
        return ['782534818042871828', '782540243626229760', '782534818025046055', '783934865224499203'];
    },

    removeAllUsersRoles(userRoles, serverRoles){
        rolesBreak = this.rolesThatBreak();
        for(let i = 1; i < serverRoles.ids.length; i++){
            try {
            if(this.userHasRole(userRoles, serverRoles.ids[i]) && !rolesBreak.includes(serverRoles.ids[i])){
                userRoles.remove(serverRoles.ids[i]);
            }
            } catch(err){
                console.log(err)
            }
        }
    },

    cacheAllUsersRoles(userRoles, serverRoles){
        cacheRoles = []
        for(let i = 1; i < serverRoles.ids.length; i++){
            if(this.userHasRole(userRoles, serverRoles.ids[i])){
                cacheRoles.push(serverRoles.ids[i]);
            }
        }
        return cacheRoles;
    },

    addUserRoles(userRoles, cacheRoles){
        for(let i = 0; i < cacheRoles.length; i++){
            if(!this.rolesThatBreak().includes(cacheRoles[i]))
                userRoles.add(cacheRoles[i]);
        }
    }, 

    moveUserToChannel(interaction, userId, channel_id){

        if ( !this.userInVoiceChannel(interaction, userId) ){
            interaction.followUp(`${userId} is not in a voice channel at this time. Unable to move to channel.`);
            return;
        }

        if(this.getUserVoiceChannel(interaction, userId).id === channel_id){
            interaction.followUp(`${userId} is already in this channe, Move has been cancelled.`);
            return;
        }

        const userCheck = interaction.guild.members.cache.get(userId);


        userCheck.voice.setChannel(channel_id)
    },

    getUserVoiceChannel(interaction, userId){ 

        const userCheck = interaction.guild.members.cache.get(userId);

        return userCheck.voice.channel;
    },
    
    setTimeoutRole(roles, role_timeout){
        for ( var i = 0; i < 5; i++ ) {
            if(this.userHasRole(roles, role_timeout))
                break;
            roles.add(role_timeout)
        }
    },

    removeTimeoutRole(roles, role_timeout){
        for ( var i = 0; i < 5; i++ ) {
            if(!this.userHasRole(roles, role_timeout))
                break;
            roles.remove(role_timeout)       
        }
    },

    deleteReply(interaction){
        setTimeout(() => {
            interaction.deleteReply()
        }, 10000);
    },

    getUserActivity(member){
        return member.presence.activities[0];
    },

    getRandomMeme() {
        const promise = axios('https://api.imgflip.com/get_memes')

        const dataPromise = promise.then(response => response.data )

        // Random number based on the length of dataPromise
        const randomMeme = dataPromise.then(data => data.data.memes[Math.floor(Math.random() * data.data.memes.length)])

        return randomMeme.url;
        
    },

    blankEmbedLine(){
        return { name: '\u200B', value: '\u200B' }
    }

}