const dotenv = require('dotenv');
const { Client , GatewayIntentBits } = require('discord.js');

dotenv.config();

const client = new Client( { intents: [GatewayIntentBits.Guilds]});

client.once('ready', () => {
    console.log('Ready!');
    });


client.login(process.env.DISCORD_TOKEN);