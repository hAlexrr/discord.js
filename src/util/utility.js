module.exports = {
    userInVoiceChannel(interaction, userId) {      
        const userCheck = interaction.guild.members.cache.get(userId);

        if(!userCheck.voice.channel) 
            return false;
            
        return true;
    }

}