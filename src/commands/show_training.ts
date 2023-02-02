import { ColorResolvable, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import config from "../config";
import { ICommandExecutable } from "../types/ICommandExecutable";

const show_training: ICommandExecutable = {
	command: new SlashCommandBuilder()
		.setName("show-training")
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

				//Find Color from config
				let colour = "#4aaace";
				let team = "";

				Object.keys(config.teams).forEach((key) => {
					if (
						event.subcalendar_ids.includes(
							config.teams[key].teamupId
						)
					) {
						team = team + key;
						colour = config.teams[key].colour;
					}
				});

				return new EmbedBuilder()
					.setColor(colour as ColorResolvable)
					.setTitle(event.title)
					.setDescription(
						`**Time**: ${meta}
${event.notes.length > 1 ? `**Notes**: ${event.notes}` : "  "}`
					)
					.setFooter({
						text: `For Teams: ${team}`,
					});
			}),
		});

		//await interaction.reply("Pong!");
	},
};

export default show_training;
