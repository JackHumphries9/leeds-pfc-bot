import {
	CacheType,
	Embed,
	EmbedBuilder,
	Interaction,
	SlashCommandBooleanOption,
	SlashCommandBuilder,
} from "discord.js";
import fetchCalendarData from "../fetchCalendarData";
import { ICommandExecutable } from "../types/ICommandExecutable";

const refresh_cache: ICommandExecutable = {
	command: new SlashCommandBuilder()
		.setName("refresh-cache")
		.setDescription("Refreshes the TeamUp Cache")
		.addBooleanOption(
			new SlashCommandBooleanOption()
				.setName("data")
				.setDescription("Show the JSON data back from the API")
		) as any,
	execute: async (interaction) => {
		const action = await interaction.deferReply();

		let card = new EmbedBuilder();

		try {
			const data = await fetchCalendarData();

			global.calendar_cache = data;

			card.setTitle("Success!").setColor("#00FF00")
				.setDescription(`Sucessfully updated the calendar cache.
${
	true
		? `*Data*: 
${JSON.stringify(data, null, 4)}`
		: ""
}
                `);
		} catch {
			card.setTitle("Error!")
				.setColor("#FF0000")
				.setDescription("Failed to update the calendar cache.");
		} finally {
			interaction.followUp({
				embeds: [card],
			});
		}

		// Check for boolean

		//await interaction.reply("Pong!");
	},
};

export default refresh_cache;
