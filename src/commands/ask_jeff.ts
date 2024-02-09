import {
	CommandInteractionOptionResolver,
	EmbedBuilder,
	SlashCommandBuilder,
} from "discord.js";
import { ICommandExecutable } from "../types/ICommandExecutable";
import axios, { AxiosResponse } from "axios";
import { logError } from "../utils/logger";

interface IJeffResponse {
	response: string;

	status: string;
}

const ask_jeff: ICommandExecutable = {
	command: new SlashCommandBuilder()
		.setName("ask-jeff")
		.setDescription("Ask a powerchair football question to Jeff, the Ref!")
		.addStringOption((str) => {
			str.setDescription("A question or query to ask Jeff.");
			str.setName("query");
			str.setMinLength(10);
			str.setRequired(true);
			return str;
		})
		.addBooleanOption((bool) => {
			bool.setName("ephemeral");
			bool.setDescription("Should the response be hidden?");
			return bool;
		}),
	execute: async (interaction) => {
		await interaction.deferReply({
			ephemeral: (
				interaction.options as CommandInteractionOptionResolver
			).getBoolean("ephemeral")
				? true
				: false,
		});

		const response = new EmbedBuilder();

		response.setAuthor({
			name: "Jeff, the Ref",
			iconURL: "https://jackh.club/leedspfc/jeff_logo.webp",
		});

		response.setThumbnail("https://jackh.club/leedspfc/jeff_logo.webp");

		try {
			const request = await axios.post<IJeffResponse>(
				process.env.JEFF_URL +
					"?workflowApiKey=" +
					process.env.JEFF_KEY,
				{
					query: (
						interaction.options as CommandInteractionOptionResolver
					).getString("query"),
				}
			);

			response.setColor("Blue");
			response.setDescription(`
                ${request.data.response}
    
                *Please note that there may be mistakes and inaccuracies with the responses*
            `);
		} catch (e: any) {
			logError("An error occured while asking Jeff:", e);
			response.setColor("Red");
			response.setTitle("An Error Occured!");
			response.setDescription(
				"Unfortunately, Jeff threw in a sickie today, hes not responding. Maybe try again."
			);
		} finally {
			await interaction.followUp({
				embeds: [response],
			});
		}
	},
};

export default ask_jeff;
