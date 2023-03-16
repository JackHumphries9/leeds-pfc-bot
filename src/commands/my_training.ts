import { ColorResolvable, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import config from "../config";
import { ICommandExecutable } from "../types/ICommandExecutable";
import { Attendance } from "../types/UtilTypes";
import { debug } from "../utils/logger";
import niceDate from "../utils/niceDate";

const my_training: ICommandExecutable = {
	command: new SlashCommandBuilder()
		.setName("training")
		.setDescription("Shows your training sessions for the week"),
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

		const embeds = (
			await Promise.all(
				global.calendar_cache.map(async (event) => {
					var shouldShow = false;

					event.subcalendar_ids.forEach(async (id) => {
						if (
							//@ts-ignore
							interaction.member.roles.cache.find((role) =>
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

					const meta = niceDate(
						new Date(event.start_dt),
						new Date(event.end_dt),
						event.all_day
					);

					const att: Attendance =
						await global.repository.getEventAttendanceForUser(
							event.id,
							interaction.user.id
						);

					return new EmbedBuilder()
						.setColor(
							config.eventMap[event.subcalendar_ids[0]].colour ||
								("#4aaace" as ColorResolvable)
						)
						.setTitle(event.title)
						.setDescription(
							`**Time**: ${meta}
${event.notes.length > 1 ? `**Notes**: ${event.notes}` : "  "}
${
	att
		? att.attending
			? ":white_check_mark: You are attending this event."
			: ":negative_squared_cross_mark: You are not attending this event."
		: ":question: You have not RSVP'd to this event."
}
`
						)
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

		await interaction.followUp({
			embeds: embeds,
		});
	},
};

export default my_training;
