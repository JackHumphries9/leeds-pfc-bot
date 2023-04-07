import {
	CommandInteractionOptionResolver,
	EmbedBuilder,
	SlashCommandBuilder,
} from "discord.js";
import fetchCalendarData from "../fetchCalendarData";
import { ICommandExecutable } from "../types/ICommandExecutable";
import { hasPermissions } from "../utils/hasPermissions";
import { logAction } from "../utils/logAction";

const refresh_cache: ICommandExecutable = {
	command: new SlashCommandBuilder()
		.setName("refresh-teamup")
		.setDescription("Refreshes the TeamUp Cache")
		.setDefaultMemberPermissions(0x8)
		.addBooleanOption((opt) => {
			opt.setName("data");
			opt.setDescription("Show the JSON data back from the API");
			return opt;
		}),
	execute: async (interaction) => {
		await interaction.deferReply({ ephemeral: true });

		if (!(await hasPermissions(interaction))) return;
		logAction(
			`Refresh Cache command used by ${interaction.user.tag}`,
			interaction.client
		);

		let card = new EmbedBuilder();

		const showData: boolean = (
			interaction.options as CommandInteractionOptionResolver
		).getBoolean("data");

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
