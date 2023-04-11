import {
	ActivityType,
	Client,
	Events,
	GatewayIntentBits,
	TextChannel,
} from "discord.js";
import registerCommands from "./registerCommands";
import fetchCalendarData from "./fetchCalendarData";
import { logError, info } from "./utils/logger";
import { handleRSVP } from "./handlers/handleRSVP";
import config from "./config";
import schedule from "node-schedule";
import { RedisRepository } from "./repositories/redisRepository";
import {
	attendance,
	debug_command,
	my_training,
	refresh_cache,
	rsvp,
	show_training,
	say,
} from "./commands";
import { showRSVP } from "./showRSVP";
import { hasPermissions } from "./utils/hasPermissions";
import { logAction } from "./utils/logAction";
import { handleVerifyModal } from "./handlers/handleVerifyModal";
import { handleVerify } from "./handlers/handleVerify";
import customIdParser from "./utils/commandParser";
import handleAcceptVerify from "./handlers/handleAcceptVerify";

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
	// [show_training_for.command.name]: show_training_for,
	[show_training.command.name]: show_training,
	[my_training.command.name]: my_training,
	[refresh_cache.command.name]: refresh_cache,
	[rsvp.command.name]: rsvp,
	[attendance.command.name]: attendance,
	[debug_command.command.name]: debug_command,
	[say.command.name]: say,
};

//global.repository = new LocalRepository();
global.repository = new RedisRepository();

(async () => await registerCommands(global.commands))();

const client = new Client({
	intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers],
});

// Setup automatic cache refresh
const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = 1;
rule.hour = 7;
rule.minute = 30;

const job = schedule.scheduleJob(rule, async () => {
	info("Starting Scheduled Job");

	logAction("Starting Scheduled Job", client);

	global.calendar_cache = await fetchCalendarData();

	info("Cache refreshed");
	info("Finding channel");

	const ch = client.channels.cache.find(
		(c) => c.id === config.tdChannelId
	) as TextChannel;

	if (!ch) {
		logError("Channel not found");
		return;
	}

	// Clear channel
	info("Channel found - clearing");

	const messages = await ch.messages.fetch();
	messages.map((m) => m.delete());

	info("Channel cleared, sending new messages");

	showRSVP(ch).then(() => {
		info("Job complete");
	});
});

client.once(Events.ClientReady, async (c) => {
	info(`Ready! Logged in as ${c.user.tag}`);
	c.user.setActivity("Powerchair Football", { type: ActivityType.Playing });
	global.calendar_cache = await fetchCalendarData();
	logAction("The bot has started up!", client);
	//job.invoke();
});

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isCommand()) return;

	if (interaction.commandName === "rsvp") {
		try {
			await interaction.deferReply({ ephemeral: true });

			const perms = await hasPermissions(interaction);

			if (!perms) return;

			job.invoke();
			await interaction.editReply({
				content: "RSVP updated!",
			});
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
		return;
	}

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
		return;
	}
});

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isButton()) return;
	info(`Executing button interaction '${interaction.customId}...'`);

	const { command, data: commandData } = customIdParser(interaction.customId);

	if (command === "rsvp") {
		try {
			return await handleRSVP(interaction);
		} catch (error) {
			logError(
				"There was an error while executing this command! More info:",
				error
			);

			//await interaction.reply({
			//content: "There was an error while executing this command!",
			//ephemeral: true,
			//});
		}
		return;
	}

	if (command === "command") {
		try {
			if (interaction.customId === "command/attendance") {
				return await attendance.execute(interaction as any);
			}
			if (interaction.customId === "command/mytraining") {
				return await my_training.execute(interaction as any);
			}
		} catch (error) {
			logError(
				"There was an error while executing this command! More info:",
				error
			);

			//await interaction.reply({
			//	content: "There was an error while executing this command!",
			//	ephemeral: true,
			//});
			return;
		}
	}

	if (command === "verify") {
		try {
			return await handleVerifyModal(interaction);
		} catch (error) {
			logError(
				"There was an error while executing this command! More info:",
				error
			);

			await interaction.reply({
				content: "There was an error while executing this command!",
				ephemeral: true,
			});
			return;
		}
	}

	if (command === "acceptVerify") {
		try {
			return await handleAcceptVerify(interaction);
		} catch (error) {
			logError(
				"There was an error while executing this command! More info:",
				error
			);

			await interaction.reply({
				content: "There was an error while executing this command!",
				ephemeral: true,
			});
			return;
		}
	}

	await interaction.reply({
		content: "There was an error while executing this command!",
		ephemeral: true,
	});

	return;
});

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isModalSubmit()) return;

	if (interaction.customId === "verifyModal") {
		try {
			return await handleVerify(interaction);
		} catch (error) {
			logError(
				"There was an error while executing this command! More info:",
				error
			);

			await interaction.reply({
				content: "There was an error while executing this command!",
				ephemeral: true,
			});
			return;
		}
	}
});

client.on(Events.GuildMemberAdd, async (member) => {
	const channel: any = member.guild.channels.cache.find(
		(ch) => ch.id === config.welcomeChannelId
	);

	if (!channel) return;

	await channel.send(`Welcome to the server, ${member}!`);
});

client.login(TOKEN);
