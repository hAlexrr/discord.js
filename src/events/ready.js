module.exports = {
    name: 'ready',
    once: true,
    execute(client) {
        console.log(`Ready! Logged in as ${client.user.tag}`);
        //Set status to watching
        client.user.setActivity('Watching you sleep');
    },
}