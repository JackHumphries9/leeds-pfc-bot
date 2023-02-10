import { ActivityType, Client, Events, GatewayIntentBits } from "discord.js";
import ping from "./commands/ping";
import registerCommands from "./registerCommands";
import fetchCalendarData from "./fetchCalendarData";
import show_training from "./commands/show_all_training";
import refresh_cache from "./commands/refresh_cache";
import { logError, info } from "./utils/logger";
import my_training from "./commands/my_training";
import show_training_for from "./commands/show_training_for";
import rsvp from "./commands/rsvp";
import { handleRSVP } from "./handleRSVP";
import show_rsvp from "./commands/show_rsvp";
import config from "./config";

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
	[rsvp.command.name]: rsvp,
	[show_rsvp.command.name]: show_rsvp,
};

global.attendance = [];
(async () => await registerCommands(global.commands))();

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

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

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isButton()) return;
	info(`Executing button interaction '${interaction.customId}...'`);

	const command = interaction.customId.split("/")[0];

	if (command === "rsvp") {
		return await handleRSVP(interaction);
	}

	interaction.reply({
		ephemeral: true,
		content: "Button pressed! (id: " + interaction.customId + ")",
	});
});

client.on(Events.GuildMemberAdd, async (member) => {
	const channel = member.guild.channels.cache.find(
		(ch) => ch.id === config.welcomeChannelId
	);

	if (!channel) return;

	// @ts-ignore
	channel.send(`Welcome to the server, ${member}`);
});

client.login(TOKEN);
