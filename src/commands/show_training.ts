import { ColorResolvable, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import config from "../config";
import { ICommandExecutable } from "../types/ICommandExecutable";

const show_training: ICommandExecutable = {
	command: new SlashCommandBuilder()
		.setName("show-training")
		.setDescription("Shows all training sessions for the week"),
	execute: async (interaction) => {
		await interaction.deferReply({ ephemeral: false });

		// const embeds = [];

		// global.calendar_cache.forEach((event) => {
		// 	embeds.push(
		// 		new EmbedBuilder()
		// 			.setColor("#0000FE")
		// 			.setTitle(event.title)
		// 			.setDescription(event.notes)
		// 			.setTimestamp(new Date(event.start_dt))
		// 	);
		// });

		interaction.followUp({
			embeds: global.calendar_cache.map((event) => {
				console.dir(event);

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
