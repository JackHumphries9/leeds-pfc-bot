import { ColorResolvable, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import config from "../config";
import { ICommandExecutable } from "../types/ICommandExecutable";

const show_training: ICommandExecutable = {
	command: new SlashCommandBuilder()
		.setName("show-all-training")
		.setDescription("Shows all training sessions for the week"),
	execute: async (interaction) => {
		await interaction.deferReply({ ephemeral: false });

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
				let meta = ``;

				if (
					new Date(event.start_dt).getDay() ===
					new Date(event.end_dt).getDay()
				) {
					meta = `${new Date(event.start_dt).toLocaleString("en-GB", {
						dateStyle: "full",
						timeStyle: "short",
					})} to ${new Date(event.end_dt).toLocaleTimeString(
						"en-GB",
						{
							timeStyle: "short",
						}
					)}`;
				} else {
					meta = `${new Date(event.start_dt).toLocaleString("en-GB", {
						dateStyle: "full",
						timeStyle: "short",
					})} to ${new Date(event.start_dt).toLocaleString("en-GB", {
						dateStyle: "full",
						timeStyle: "short",
					})}`;
				}

				return new EmbedBuilder()
					.setColor(
						config.colorMap[event.subcalendar_ids[0]].colour ||
							("#4aaace" as ColorResolvable)
					)
					.setTitle(event.title)
					.setDescription(
						`**Time**: ${meta}
${event.notes.length > 1 ? `**Notes**: ${event.notes}` : "  "}`
					)
					.setFooter({
						text: `For: ${event.subcalendar_ids
							.map((id) => config.colorMap[id.toString()].name)
							.join(", ")}`,
					});
			}),
		});

		//await interaction.reply("Pong!");
	},
};

export default show_training;
