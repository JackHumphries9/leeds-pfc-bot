import { ActivityType, Client, Events, GatewayIntentBits } from "discord.js";
import ping from "./commands/ping";
import registerCommands from "./registerCommands";
import fetchCalendarData from "./fetchCalendarData";
import show_training from "./commands/show_training";
import refresh_cache from "./commands/refresh_cache";

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

if (!TOKEN) {
	throw new Error("No token provided");
}

if (!CLIENT_ID) {
	throw new Error("No client id provided");
}

global.commands = {
	[ping.command.name]: ping,
	[show_training.command.name]: show_training,
	[refresh_cache.command.name]: refresh_cache,
};

(async () => await registerCommands(commands))();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, async (c) => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
	c.user.setActivity("Powerchair Football", { type: ActivityType.Playing });
	global.calendar_cache = await fetchCalendarData();
});

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isCommand()) return;

	const command = global.commands[interaction.commandName];

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({
			content: "There was an error while executing this command!",
			ephemeral: true,
		});
	}
});

client.login(TOKEN);
