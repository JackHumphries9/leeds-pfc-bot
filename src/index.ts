import { ActivityType, Client, Events, GatewayIntentBits } from "discord.js";
import ping from "./commands/ping";
import registerCommands from "./registerCommands";
import fetchCalendarData from "./fetchCalendarData";
import show_training from "./commands/show_all_training";
import refresh_cache from "./commands/refresh_cache";
import { logError, info } from "./utils/logger";
import my_training from "./commands/my_training";
import show_training_for from "./commands/show_training_for";

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
	[my_training.command.name]: my_training,
	[refresh_cache.command.name]: refresh_cache,
	[show_training_for.command.name]: show_training_for,
};

(async () => await registerCommands(global.commands))();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, async (c) => {
	info(`Ready! Logged in as ${c.user.tag}`);
	c.user.setActivity("Powerchair Football", { type: ActivityType.Playing });
	global.calendar_cache = await fetchCalendarData();
});

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isCommand()) return;

	const command = global.commands[interaction.commandName];

	if (!command) return;

	try {
		info(`Executing command '${interaction.commandName}...'`);
		await command.execute(interaction);
	} catch (error) {
		logError("There was an error while executing this command! More info:");
		console.error(error);
		await interaction.reply({
			content: "There was an error while executing this command!",
			ephemeral: true,
		});
	}
});

client.login(TOKEN);
