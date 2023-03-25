import { ColorResolvable, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import config from "../config";
import { ICommandExecutable } from "../types/ICommandExecutable";
import { logAction } from "../utils/logAction";
import niceDate from "../utils/niceDate";

const show_training: ICommandExecutable = {
	command: new SlashCommandBuilder()
		.setName("all-training")
		.setDescription("Shows all training sessions for the week"),
	execute: async (interaction) => {
		await interaction.deferReply({ ephemeral: true });

		logAction(
			`Show Training command used by ${interaction.user.tag}`,
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

		interaction.followUp({
			embeds: global.calendar_cache.map((event) => {
				const meta = niceDate(
					new Date(event.start_dt),
					new Date(event.end_dt),
					event.all_day
				);

				return new EmbedBuilder()
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
									: null
							)
							.filter((i) => i)
							.join(", ")}`,
					});
			}),
		});
	},
};

export default show_training;
