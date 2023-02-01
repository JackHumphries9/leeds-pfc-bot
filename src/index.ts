import {
	Client,
	Collection,
	Events,
	GatewayIntentBits,
	REST,
	Routes,
} from "discord.js";
import config from "./config";
import ping from "./commands/ping";
import registerCommands from "./registerCommands";
import { ICommandExecutable } from "./types/ICommandExecutable";

const TOKEN = process.env.TOKEN;
const CLIENT_ID = process.env.CLIENT_ID;

if (!TOKEN) {
	throw new Error("No token provided");
}

if (!CLIENT_ID) {
	throw new Error("No client id provided");
}

const commands: { [key: string]: ICommandExecutable } = {
	[ping.command.name]: ping,
};

(async () => await registerCommands(commands))();

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once(Events.ClientReady, (c) => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isCommand()) return;

	const command = commands[interaction.commandName];

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({
			content: "There was an error while executing this command!",
			ephemeral: true,
		});
	}
});

client.login(TOKEN);
