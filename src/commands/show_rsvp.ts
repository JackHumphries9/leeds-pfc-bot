import { ColorResolvable, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import config from "../config";
import { getAttendanceFromEventId } from "../services/getAttendance";
import { ICommandExecutable } from "../types/ICommandExecutable";
import niceDate from "../utils/niceDate";

const show_rsvp: ICommandExecutable = {
	command: new SlashCommandBuilder()
		.setName("show-rsvp")
		.setDescription("Show the events that have been RSVP'd for")
		.setDefaultMemberPermissions(0x8 | 0x20 | 0x200000000)
		.addRoleOption((option) =>
			option
				.setName("role")
				.setDescription("The role to show RSVPs for")
				.setRequired(false)
		) as any,

	execute: async (interaction) => {
		await interaction.deferReply({ ephemeral: true });

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

		interaction.followUp({
			embeds: await Promise.all(
				global.calendar_cache.map(async (event) => {
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
						attMeta += `*${user.displayName}* - ${
							att.attending ? "Attending" : "Not Attending"
						}\n`;
					});

					return new EmbedBuilder()
						.setColor(
							config.teamMap[event.subcalendar_ids[0]].colour ||
								("#4aaace" as ColorResolvable)
						)
						.setTitle(event.title)
						.setDescription(`**Time**: ${meta}\n${attMeta}`)
						.setFooter({
							text: `For: ${event.subcalendar_ids
								.map((id) =>
									config.teamMap[id.toString()]
										? config.teamMap[id.toString()].name
										: "Unknown"
								)
								.join(", ")}`,
						});
				})
			),
		});
	},
};

export default show_rsvp;
