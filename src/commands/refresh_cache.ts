import { EmbedBuilder, SlashCommandBuilder } from "discord.js";
import fetchCalendarData from "../fetchCalendarData";
import { ICommandExecutable } from "../types/ICommandExecutable";
import { hasPermissions } from "../utils/hasPermissions";

const refresh_cache: ICommandExecutable = {
	command: new SlashCommandBuilder()
		.setName("refresh-teamup")
		.setDescription("Refreshes the TeamUp Cache")
		// .setDefaultMemberPermissions(0x20)
		.addBooleanOption((opt) => {
			opt.setName("data");
			opt.setDescription("Show the JSON data back from the API");
			return opt;
		}) as any,
	execute: async (interaction) => {
		await interaction.deferReply();

		if (!(await hasPermissions(interaction))) return;

		let card = new EmbedBuilder();

		//@ts-ignore
		const showData: boolean = interaction.options.getBoolean("data");

		try {
			const data = await fetchCalendarData();

			global.calendar_cache = data;

			card.setTitle("Success!").setColor("#00FF00")
				.setDescription(`Sucessfully updated the calendar cache.
${
	showData
		? `*Data*: 
\`\`\`json
${JSON.stringify(data, null, 4)}
\`\`\``
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
	},
};

export default refresh_cache;
