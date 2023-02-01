import { REST, Routes } from "discord.js";
import { ICommandExecutable } from "./types/ICommandExecutable";

const rest = new REST({ version: "10" }).setToken(process.env.TOKEN);

// and deploy your commands!
const registerCommands = async (commands: {
	[key: string]: ICommandExecutable;
}) => {
	try {
		const parsedCommands = Object.values(commands).map((command) =>
			command.command.toJSON()
		);

		console.log(`Started refreshing application (/) commands.`);

		const data = await rest.put(
			Routes.applicationCommands(process.env.CLIENT_ID),
			{
				body: parsedCommands,
			}
		);

		console.log(`Successfully reloaded application (/) commands.`);
	} catch (error) {
		// And of course, make sure you catch and log any errors!
		console.error(error);
	}
};

export default registerCommands;
