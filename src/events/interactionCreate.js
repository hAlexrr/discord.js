module.exports = {
    name: 'interactionCreate',
    async execute(client, interaction) {
        console.log(`${interaction.user.tag} in #${interaction.channel.name} triggered an interaction: ${interaction.commandName}`);if (!interaction.isChatInputCommand()) return;

		const command = client.commands.get(interaction.commandName);

		if (!command) return;

		try {
			await command.execute(interaction);
		} catch (error) {
			console.error(error);

			try {
				await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
			} catch (error) {
				await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
			}

		}
    },
}