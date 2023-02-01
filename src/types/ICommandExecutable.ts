import { CacheType, Interaction, SlashCommandBuilder } from "discord.js";

export interface ICommandExecutable {
	execute: (interaction: any) => Promise<void>;
	command: SlashCommandBuilder;
}
