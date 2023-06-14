import {
	EmbedBuilder,
	GuildMemberRoleManager,
	SlashCommandBuilder,
} from "discord.js";
import config from "../config";
import { ICommandExecutable } from "../types/ICommandExecutable";
import { IAttendance } from "../types/UtilTypes";
import { logAction } from "../utils/logAction";
import niceDate from "../utils/niceDate";
import eventEmbedBuilder from "../utils/eventEmbedBuilder";

const my_training: ICommandExecutable = {
	command: new SlashCommandBuilder()
		.setName("training")
		.setDescription("Shows your training sessions for the week"),
	execute: async (interaction) => {
		await interaction.deferReply({ ephemeral: true });

		logAction(
			`My Training command used by ${interaction.user.tag}`,
			interaction.client
		);

		if (!global.calendar_cache) {
			const card = new EmbedBuilder()
				.setTitle("Error!")
				.setColor("#FF0000")
				.setDescription(
					"Failed to show the calendar. Please try again later or use the `/refresh-cache` command."
				);

			await interaction.followUp({
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

			await interaction.followUp({
				embeds: [card],
			});
			return;
		}

		const embeds = (
			await Promise.all(
				global.calendar_cache.map(async (event) => {
					let shouldShow = false;

					if (
						!Object.keys(config.eventMap).includes(
							event.subcalendar_ids[0].toString()
						)
					) {
						return;
					}

					event.subcalendar_ids.forEach((id) => {
						if (
							(
								interaction.member
									.roles as GuildMemberRoleManager
							).cache.find((role) =>
								config.eventMap[id.toString()].roleId.includes(
									role.id.toString()
								)
							)
						) {
							shouldShow = true;
						}
					});

					if (shouldShow === false) {
						return;
					}

					const att: IAttendance =
						await global.repository.getEventAttendanceForUser(
							event.id,
							interaction.user.id
						);

					return eventEmbedBuilder({
						title: event.title,
						notes: event.notes,
						for: event.subcalendar_ids,
						when: niceDate(
							new Date(event.start_dt),
							new Date(event.end_dt),
							event.all_day
						),
						where: event.location,
						body: att
							? att.isAttending
								? ":white_check_mark: You are attending this event."
								: ":negative_squared_cross_mark: You are not attending this event."
							: ":question: You have not RSVP'd to this event.",
					});

				})
			)
		).filter((event) => event);

		if (embeds.length === 0) {
			const card = new EmbedBuilder()
				.setTitle("No Events Found!")
				.setColor("#4aaace")
				.setDescription(
					"There are no training sessions scheduled for this week."
				);

			await interaction.followUp({
				embeds: [card],
			});
			return;
		}

		await interaction.followUp({
			embeds: embeds,
		});
	},
};

export default my_training;
