import {
	CacheType,
	CommandInteraction,
	Interaction,
	SlashCommandBuilder,
} from "discord.js";

export interface ICommandExecutable {
	execute: (interaction: CommandInteraction) => Promise<void>;
	command: SlashCommandBuilder;
}
