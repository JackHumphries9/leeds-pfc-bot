import { ColorResolvable, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import config from "../config";
import { ICommandExecutable } from "../types/ICommandExecutable";
import { hasPermissions } from "../utils/hasPermissions";
import { logAction } from "../utils/logAction";
import niceDate from "../utils/niceDate";
import { getNicknameOrUsername } from "../utils/getNicknameOrUsername";
import eventEmbedBuilder from "../utils/eventEmbedBuilder";

const attendance: ICommandExecutable = {
	command: new SlashCommandBuilder()
		.setName("attendance")
		.setDescription("Show the attendance for the training sessions")
		.addRoleOption((option) =>
			option
				.setName("team")
				.setDescription("The team to show RSVPs for")
				.setRequired(false)
		),
	execute: async (interaction) => {
		await interaction.deferReply({ ephemeral: true });

		const perms = await hasPermissions(interaction);

		if (!perms) return;

		logAction(
			`Attendance command used by ${interaction.user.tag}`,
			interaction.client
		);

		if (!global.calendar_cache) {
			const card = new EmbedBuilder()
				.setTitle("Error!")
				.setColor("#FF0000")
				.setDescription(
					"Failed to show the calendar. Please try again later or use the `/refresh-cache` command."
				);

			interaction.followUp({
				embeds: [card],
			});
			return;
		}

		if (global.calendar_cache.length === 0) {
			const card = new EmbedBuilder()
				.setTitle("No Events Found!")
				.setColor("#4aaace")
				.setDescription(
					"There are no training sessions scheduled for this week."
				);

			interaction.followUp({
				embeds: [card],
			});
			return;
		}

		//@ts-ignore
		//const teamId = interaction.options.getRole("team");

		const embeds = (
			await Promise.all(
				global.calendar_cache.map(async (event) => {
					// if (teamId) {
					// 	var shouldShow = false;
					// 	event.subcalendar_ids.forEach((id) => {
					// 		if (
					// 			config.eventMap[id.toString()].roleId.includes(
					// 				teamId.id.toString()
					// 			)
					// 		) {
					// 			shouldShow = true;
					// 		}
					// 	});

					// 	if (shouldShow === false) {
					// 		return;
					// 	}
					// }

					const meta = niceDate(
						new Date(event.start_dt),
						new Date(event.end_dt),
						event.all_day
					);
					const attendance =
						await global.repository.getAttendanceFromEventId(
							event.id
						);

					var attMeta = `**RSVP**:\n`;

					if (attendance.length === 0) {
						attMeta += "No one has RSVP'd for this event yet.";
					}

					const members = await interaction.guild.members.fetch();

					attendance.forEach((att) => {
						const user = members.find((u) => att.userId === u.id);
						// KEEP IT AS IS DISCORD CLIENT DOES NOT LOAD IN ALL @ted users
						attMeta += `*${getNicknameOrUsername(user)}* - ${
							att.attending ? "Attending ✅" : "Not Attending ❌"
						}\n`;
					});

					if (
						!Object.keys(config.eventMap).includes(
							event.subcalendar_ids[0].toString()
						)
					) {
						return;
					}

					return eventEmbedBuilder({
						title: event.title,
						for: event.subcalendar_ids,
						body: attMeta,
						notes: event.notes,
						when: meta,
						where: event.location,
					});

					// return new EmbedBuilder()
					// 	.setColor(
					// 		config.eventMap[event.subcalendar_ids[0]].colour ||
					// 			("#4aaace" as ColorResolvable)
					// 	)
					// 	.setTitle(
					// 		event.title && event.title.length > 0
					// 			? event.title
					// 			: "Untitled Event"
					// 	)
					// 	.setDescription(`**Time**: ${meta}\n${attMeta}`)
					// 	.setFooter({
					// 		text: `For: ${event.subcalendar_ids
					// 			.map((id) =>
					// 				config.eventMap[id.toString()]
					// 					? config.eventMap[id.toString()].name
					// 					: null
					// 			)
					// 			.filter((i) => i)
					// 			.join(", ")}`,
					// 	});
				})
			)
		).filter((event) => event);

		if (embeds.length === 0) {
			interaction.followUp({
				embeds: [
					new EmbedBuilder()
						.setTitle("No Events Found!")
						.setColor("#4aaace")
						.setDescription(
							"There are no training sessions scheduled for this week."
						),
				],
			});
			return;
		}

		interaction.followUp({
			embeds: embeds,
		});
	},
};

export default attendance;
