import { CacheType, CommandInteraction, SlashCommandBuilder } from "discord.js";

export interface ICommandExecutable {
	execute: (interaction: CommandInteraction<CacheType>) => Promise<void>;
	command: SlashCommandBuilder;
}
