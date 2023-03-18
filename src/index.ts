import {
	ActionRowBuilder,
	ActivityType,
	ButtonBuilder,
	ButtonStyle,
	Client,
	ColorResolvable,
	EmbedBuilder,
	Events,
	GatewayIntentBits,
} from "discord.js";
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
	print,
} from "./commands";
import niceDate from "./utils/niceDate";
import { firstDayOfWeek } from "./utils/temporal";

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
	[print.command.name]: print,
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
rule.hour = 9;

const job = schedule.scheduleJob(rule, async () => {
	global.calendar_cache = await fetchCalendarData();

	info("Cache refreshed");

	client.channels.cache
		.find((c) => c.id === config.tdChannelId)
		// @ts-ignore
		?.send({});

	if (global.calendar_cache.length === 0) {
		const card = new EmbedBuilder()
			.setTitle("No Events Found!")
			.setColor("#4aaace")
			.setDescription(
				"There are no training sessions scheduled for this week."
			);

		client.channels.cache
			.find((c) => c.id === config.tdChannelId)
			// @ts-ignore
			?.send({
				embeds: [card],
			});
		return;
	}

	global.calendar_cache.map((event) => {
		const meta = niceDate(
			new Date(event.start_dt),
			new Date(event.end_dt),
			event.all_day
		);

		client.channels.cache
			.find((c) => c.id === config.tdChannelId)
			// @ts-ignore
			?.send({
				embeds: [
					new EmbedBuilder()
						.setColor(
							config.eventMap[event.subcalendar_ids[0]].colour ||
								("#4aaace" as ColorResolvable)
						)
						.setTitle(event.title)
						.setDescription(
							`**Time**: ${meta}
${event.notes.length > 1 ? `**Notes**: ${event.notes}` : "  "}`
						)
						.setFooter({
							text: `For: ${event.subcalendar_ids
								.map((id) =>
									config.eventMap[id.toString()]
										? config.eventMap[id.toString()].name
										: "Unknown"
								)
								.join(", ")}`,
						}),
				],
				components: [
					new ActionRowBuilder().addComponents(
						new ButtonBuilder()
							.setCustomId(`rsvp/${event.id}?ok`)
							.setLabel("I can attend!")
							.setStyle(ButtonStyle.Success),
						new ButtonBuilder()
							.setCustomId(`rsvp/${event.id}?notok`)
							.setLabel("I cannot attend!")
							.setStyle(ButtonStyle.Danger)
					) as any,
				],
			});
	});

	client.channels.cache
		.find((c) => c.id === config.tdChannelId)
		// @ts-ignore
		?.send({
			embeds: [
				new EmbedBuilder()
					.setTitle("Training Sessions")
					.setDescription(
						`Here are the training sessions for this week (WC: ${firstDayOfWeek(
							new Date(),
							1
						).toLocaleDateString("en-GB", {
							dateStyle: "short",
						})}). Please RSVP to the ones you can attend.`
					)
					.setColor("#4aaace"),
			],
			components: [
				new ActionRowBuilder().addComponents(
					new ButtonBuilder()
						.setCustomId(`command/attendance`)
						.setLabel("Show Attendance")
						.setStyle(ButtonStyle.Secondary)
				) as any,
			],
		});
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

	if (command === "command") {
		if (interaction.customId === "command/attendance") {
			return await attendance.execute(interaction as any);
		}
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
