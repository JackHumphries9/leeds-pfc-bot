import {
	CacheType,
	CommandInteraction,
	SlashCommandBuilder,
	SlashCommandRoleOption,
	SlashCommandSubcommandsOnlyBuilder,
} from "discord.js";

export interface ICommandExecutable {
	execute: (interaction: CommandInteraction<CacheType>) => Promise<void>;
	command:
		| SlashCommandBuilder
		| SlashCommandSubcommandsOnlyBuilder
		| Omit<SlashCommandBuilder, "addSubcommandGroup" | "addSubcommand">;
}
