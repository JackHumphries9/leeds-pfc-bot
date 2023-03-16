import { ActivityType, Client, Events, GatewayIntentBits } from "discord.js";
import registerCommands from "./registerCommands";
import fetchCalendarData from "./fetchCalendarData";
import { logError, info } from "./utils/logger";
import { handleRSVP } from "./handleRSVP";
import config from "./config";
import schedule from "node-schedule";
import { LocalRepository } from "./repositories/localRepository";
import { RedisRepository } from "./repositories/redisRepository";
import {
	attendance,
	debug_command,
	my_training,
	refresh_cache,
	rsvp,
	show_training,
} from "./commands";

process.on("SIGINT", function () {
	schedule.gracefulShutdown().then(() => process.exit(0));
});

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

if (!TOKEN) {
	throw new Error("No token provided");
}

if (!CLIENT_ID) {
	throw new Error("No client id provided");
}

// Set globals
global.commands = {
	// [ping.command.name]: ping,
	[show_training.command.name]: show_training,
	[my_training.command.name]: my_training,
	[refresh_cache.command.name]: refresh_cache,
	// [show_training_for.command.name]: show_training_for,
	[rsvp.command.name]: rsvp,
	[attendance.command.name]: attendance,
	[debug_command.command.name]: debug_command,
};

//global.repository = new LocalRepository();
global.repository = new RedisRepository();

(async () => await registerCommands(global.commands))();

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

// Setup automatic cache refresh
const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = 0;

const job = schedule.scheduleJob(rule, async () => {
	global.calendar_cache = await fetchCalendarData();
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
		logError(
			"There was an error while executing this command! More info:",
			error
		);

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
	const channel: any = member.guild.channels.cache.find(
		(ch) => ch.id === config.welcomeChannelId
	);

	if (!channel) return;

	channel.send(`Welcome to the server, ${member}!`);
});

client.login(TOKEN);
