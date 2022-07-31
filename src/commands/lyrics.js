const { SlashCommandBuilder, EmbedBuilder} = require('discord.js');
const { getLyricsForSong } = require('../util/genius');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('lyrics')
        .setDescription('Gets the lyrics of a song')
        .addStringOption(option =>
            option.setName('song')
                .setDescription('The song you want to get the lyrics of')
        ),

    execute(interaction) {
        const songString = interaction.options.getString('song');

        //Get lyrics of the sound using getLyricsForSong
        getLyricsForSong(songString).then(songDetails => {

            // console.log(song)
            const song = songDetails.response.song

            
            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setAuthor({ name: interaction.user.username, iconURL: interaction.user.avatarURL() })
                .setTitle(`${song.full_title}`)
                .setDescription('Release Date: ' + song.release_date_for_display)
                .addFields(
                    { name: "Lyrics Status", value: song.lyrics_state.toUpperCase() },
                    { name: 'Genius Lyrics URL', value: `[Click Here](${song.url})`, inline: true },
                )
                 .addFields(
                        { name: 'Genius Music Link', value: `[Click Here](${song.apple_music_player_url})`, inline: true },
                        { name: '\u200B', value: '\u200B' },
                )
                .setThumbnail(song.song_art_image_thumbnail_url)
                .setFooter( { text: song.stats.hot ? '🔥 ':'' + song.stats.pageviews+ ' views' } )

                for ( let i in song.media){
                    if (song.media[i].provider == 'youtube'){
                        embed.addFields(
                            { name: 'YouTube Link', value: `[Click Here](${song.media[i].url})`, inline: true },
                        )
                    } else if (song.media[i].provider == 'soundcloud'){
                        embed.addFields(
                            { name: 'SoundCloud Link', value: `[Click Here](${song.media[i].url})`, inline: true },
                        )
                    } else if (song.media[i].provider == 'spotify'){
                        embed.addFields(
                            { name: 'Spotify Link', value: `[Click Here](${song.media[i].url})`, inline: true },
                        )
                    }
                }
            
            interaction.reply({
                content: 'Test',
                embeds: [embed],
                fetchReply: true
            });

        }   ).catch(error => {
            console.log(error)
            // interaction.channel.send(error);
        }  );

    }
}

