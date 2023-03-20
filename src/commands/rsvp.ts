import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ColorResolvable,
	EmbedBuilder,
	SlashCommandBuilder,
} from "discord.js";
import config from "../config";
import fetchCalendarData from "../fetchCalendarData";
import { ICommandExecutable } from "../types/ICommandExecutable";
import niceDate from "../utils/niceDate";
import { firstDayOfWeek } from "../utils/temporal";

const rsvp: ICommandExecutable = {
	command: new SlashCommandBuilder()
		.setName("rsvp")
		.setDescription(
			"Shows the training sessions for the week with RSVP options"
		)
		.setDefaultMemberPermissions(0x20),
	// .addRoleOption((option) => {
	// 	return option
	// 		.setName("team")
	// 		.setDescription("The team to show training sessions for for")
	// 		.setRequired(false);
	// })
	// .addBooleanOption((option) => {
	// 	return option
	// 		.setName("refresh")
	// 		.setDescription("Refresh the callendar")
	// 		.setRequired(false);
	// })
	// .addBooleanOption((option) => {
	// 	return option
	// 		.setName("clear")
	// 		.setDescription("Clear the attendance")
	// 		.setRequired(false);
	// }) as any,
	execute: async (interaction) => {
		await interaction.deferReply({ ephemeral: true });
		// 	// @ts-ignore
		// 	if (interaction.options.getBoolean("refresh")) {
		// 		global.calendar_cache = await fetchCalendarData();
		// 	}
		// 	// if (
		// 	// 	!interaction.memberPermissions.has("Administrator") ||
		// 	// 	!interaction.memberPermissions.has("ManageGuild")
		// 	// ) {
		// 	// 	interaction.followUp({
		// 	// 		embeds: [
		// 	// 			new EmbedBuilder()
		// 	// 				.setTitle("Error!")
		// 	// 				.setColor("#FF0000")
		// 	// 				.setDescription(
		// 	// 					"You do not have the required permissions to run this command."
		// 	// 				),
		// 	// 		],
		// 	// 	});
		// 	// 	return;
		// 	// }
		// 	if (
		// 		//@ts-ignore
		// 		!interaction.member.roles.cache.find(
		// 			(r) => r.id == config.adminRoleId
		// 		)
		// 	) {
		// 		interaction.followUp({
		// 			embeds: [
		// 				new EmbedBuilder()
		// 					.setTitle("Not admin!")
		// 					.setColor("#FF0000")
		// 					.setDescription(
		// 						"You cannot use this command as you are not an admin."
		// 					),
		// 			],
		// 		});
		// 		return;
		// 	}
		// 	if (!global.calendar_cache) {
		// 		const card = new EmbedBuilder()
		// 			.setTitle("Error!")
		// 			.setColor("#FF0000")
		// 			.setDescription(
		// 				"Failed to show the calendar. Please try again later or use the `/refresh-cache` command."
		// 			);
		// 		interaction.followUp({
		// 			embeds: [card],
		// 		});
		// 		return;
		// 	}
		// 	//@ts-ignore
		// 	const team = interaction.options.getRole("team");
		// 	if (global.calendar_cache.length === 0) {
		// 		const card = new EmbedBuilder()
		// 			.setTitle("No Events Found!")
		// 			.setColor("#4aaace")
		// 			.setDescription(
		// 				"There are no training sessions scheduled for this week."
		// 			);
		// 		interaction.followUp({
		// 			embeds: [card],
		// 		});
		// 		return;
		// 	}
		// 	global.calendar_cache.map((event) => {
		// 		const meta = niceDate(
		// 			new Date(event.start_dt),
		// 			new Date(event.end_dt),
		// 			event.all_day
		// 		);
		// 		if (team) {
		// 			var shouldShow = false;
		// 			event.subcalendar_ids.forEach((id) => {
		// 				if (
		// 					config.eventMap[id.toString()].roleId ===
		// 					team.id.toString()
		// 				) {
		// 					shouldShow = true;
		// 				}
		// 			});
		// 			if (shouldShow === false) {
		// 				return;
		// 			}
		// 		}
		// 		interaction.channel.send({
		// 			embeds: [
		// 				new EmbedBuilder()
		// 					.setColor(
		// 						config.eventMap[event.subcalendar_ids[0]].colour ||
		// 							("#4aaace" as ColorResolvable)
		// 					)
		// 					.setTitle(event.title)
		// 					.setDescription(
		// 						`**Time**: ${meta}
		// ${event.notes.length > 1 ? `**Notes**: ${event.notes}` : "  "}`
		// 					)
		// 					.setFooter({
		// 						text: `For: ${event.subcalendar_ids
		// 							.map((id) =>
		// 								config.eventMap[id.toString()]
		// 									? config.eventMap[id.toString()].name
		// 									: "Unknown"
		// 							)
		// 							.join(", ")}`,
		// 					}),
		// 			],
		// 			components: [
		// 				new ActionRowBuilder().addComponents(
		// 					new ButtonBuilder()
		// 						.setCustomId(`rsvp/${event.id}?ok`)
		// 						.setLabel("I can attend!")
		// 						.setStyle(ButtonStyle.Success),
		// 					new ButtonBuilder()
		// 						.setCustomId(`rsvp/${event.id}?notok`)
		// 						.setLabel("I cannot attend!")
		// 						.setStyle(ButtonStyle.Danger)
		// 				) as any,
		// 			],
		// 		});
		// 	});
		// 	interaction.channel.send({
		// 		embeds: [
		// 			new EmbedBuilder()
		// 				.setTitle("Training Sessions")
		// 				.setDescription(
		// 					`Here are the training sessions for this week (WC: ${firstDayOfWeek(
		// 						new Date(),
		// 						1
		// 					).toLocaleDateString("en-GB", {
		// 						dateStyle: "short",
		// 					})}). Please RSVP to the ones you can attend.`
		// 				)
		// 				.setColor("#4aaace"),
		// 		],
		// 		components: [
		// 			new ActionRowBuilder().addComponents(
		// 				new ButtonBuilder()
		// 					.setCustomId(`command/attendance`)
		// 					.setLabel("Show Attendance")
		// 					.setStyle(ButtonStyle.Secondary)
		// 			) as any,
		// 		],
		// 	});
		// 	// @ts-ignore
		// 	if (interaction.options.getBoolean("clear")) {
		// 		await global.repository.clearAttendance();
		// 	}
		// 	interaction.followUp({
		// 		embeds: [
		// 			new EmbedBuilder()
		// 				.setTitle("RSVP")
		// 				.setDescription("Command executed successfully")
		// 				.setColor("#4aaace"),
		// 		],
		// 	});
		interaction.followUp({
			embeds: [
				new EmbedBuilder()
					.setTitle("Unused Command")
					.setDescription(
						"This command is a phantom command and is not used."
					)
					.setColor("#4aaace"),
			],
		});
	},
};

export default rsvp;
