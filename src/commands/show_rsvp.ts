import { ColorResolvable, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import config from "../config";
import { getAttendanceFromEventId } from "../services/getAttendance";
import { ICommandExecutable } from "../types/ICommandExecutable";
import niceDate from "../utils/niceDate";

const show_rsvp: ICommandExecutable = {
	command: new SlashCommandBuilder()
		.setName("attendance")
		.setDescription("Show the attendance for the training sessions")
		.addRoleOption((option) =>
			option
				.setName("team")
				.setDescription("The team to show RSVPs for")
				.setRequired(false)
		) as any,

	execute: async (interaction) => {
		await interaction.deferReply({ ephemeral: true });

		if (
			//@ts-ignore
			!interaction.member.roles.cache.find(
				(r) => r.id == config.adminRoleId
			)
		) {
			interaction.followUp({
				embeds: [
					new EmbedBuilder()
						.setTitle("Not admin!")
						.setColor("#FF0000")
						.setDescription(
							"You cannot use this command as you are not an admin."
						),
				],
			});
			return;
		}

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
		const teamId = interaction.options.getRole("team");

		const embeds = (
			await Promise.all(
				global.calendar_cache.map(async (event) => {
					if (teamId) {
						var shouldShow = false;
						event.subcalendar_ids.forEach((id) => {
							if (
								config.eventMap[id.toString()].roleId.includes(
									teamId.id.toString()
								)
							) {
								shouldShow = true;
							}
						});

						if (shouldShow === false) {
							return;
						}
					}

					const meta = niceDate(
						new Date(event.start_dt),
						new Date(event.end_dt),
						event.all_day
					);
					const attendance = await getAttendanceFromEventId(event.id);

					var attMeta = `\n**RSVP**:\n`;

					if (attendance.length === 0) {
						attMeta += "No one has RSVP'd for this event yet.";
					}

					attendance.forEach((att) => {
						const user = interaction.guild.members.cache.find(
							(u) => att.userId === u.id
						);
						attMeta += `*${user}* - ${
							att.attending ? "Attending" : "Not Attending"
						}\n`;
					});

					return new EmbedBuilder()
						.setColor(
							config.eventMap[event.subcalendar_ids[0]].colour ||
								("#4aaace" as ColorResolvable)
						)
						.setTitle(event.title)
						.setDescription(`**Time**: ${meta}\n${attMeta}`)
						.setFooter({
							text: `For: ${event.subcalendar_ids
								.map((id) =>
									config.eventMap[id.toString()]
										? config.eventMap[id.toString()].name
										: null
								)
								.filter((i) => i)
								.join(", ")}`,
						});
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

export default show_rsvp;
