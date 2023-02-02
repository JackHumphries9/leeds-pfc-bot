import { REST, Routes } from "discord.js";
import { ICommandExecutable } from "./types/ICommandExecutable";
import { info, logError } from "./utils/logger";

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

// and deploy your commands!
const registerCommands = async (commands: {
	[key: string]: ICommandExecutable;
}) => {
	try {
		const parsedCommands = Object.values(commands).map((command) =>
			command.command.toJSON()
		);

		info(`Started refreshing application (/) commands.`);

		await rest.put(Routes.applicationCommands(process.env.CLIENT_ID), {
			body: parsedCommands,
		});

		info(`Successfully reloaded application (/) commands.`);
	} catch (error) {
		logError("There was an error while registering commands! More info:");
		console.error(error);
	}
};

export default registerCommands;
