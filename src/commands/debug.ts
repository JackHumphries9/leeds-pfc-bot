import {
	CommandInteractionOptionResolver,
	EmbedBuilder,
	Options,
	SlashCommandBuilder,
} from "discord.js";
import { ICommandExecutable } from "../types/ICommandExecutable";
import { hasPermissions } from "../utils/hasPermissions";
import { logAction } from "../utils/logAction";
import { info } from "../utils/logger";
import config, { ROLEIDS } from "../config";

const debug: ICommandExecutable = {
	command: new SlashCommandBuilder()
		.setName("debug")
		.setDescription("Debugging Tools")
		.setDefaultMemberPermissions(0x8)
		.addSubcommand((subcommand) => {
			return subcommand
				.setName("clear")
				.setDescription("Clear the store")
				.addBooleanOption((option) => {
					return option
						.setName("all")
						.setDescription("Clear the entire store")
						.setRequired(true);
				});
		})
		.addSubcommand((subcommand) => {
			return subcommand.setName("view").setDescription("View the store");
		})
		.addSubcommand((subcommand) => {
			return subcommand
				.setName("list-members")
				.setDescription("List all members in the server");
		}),
	execute: async (interaction) => {
		await interaction.deferReply({ ephemeral: true });

		logAction(
			`Debug command used by ${interaction.user.tag}`,
			interaction.client
		);

		const perms = await hasPermissions(interaction);

		if (!perms) return;

		if (
			(
				interaction.options as CommandInteractionOptionResolver
			).getSubcommand() === "clear"
		) {
			const all: boolean = (
				interaction.options as CommandInteractionOptionResolver
			).getBoolean("data");

			if (all) {
				info("Clearing the store");
				global.repository.clearAttendance();
			} else {
				info("Clearing the old store");
				global.repository.clearOldAttendance();
			}

			const card = new EmbedBuilder()
				.setTitle("Cleared!")
				.setDescription("Cleared the store");

			interaction.followUp({
				embeds: [card],
			});

			return;
		}

		if (
			(
				interaction.options as CommandInteractionOptionResolver
			).getSubcommand() === "view"
		) {
			const card = new EmbedBuilder().setTitle("Store View")
				.setDescription(`Here is the store:
\`\`\`json\n${JSON.stringify(
				await global.repository.getAllAttendance(),
				null,
				4
			)}\`\`\``);

			interaction.followUp({
				embeds: [card],
			});

			return;
		}

		const card = new EmbedBuilder()
			.setTitle("Not found!")
			.setDescription("Command not found!");

		interaction.followUp({
			embeds: [card],
		});
		if (
			(
				interaction.options as CommandInteractionOptionResolver
			).getSubcommand() === "list-members"
		) {
			const members = await interaction.guild.members.fetch();

			let tm: {
				chariots: string[];
				dynamos: string[];
				centurions: string[];
				hurricanes: string[];
				spartans: string[];
				amazons: string[];
				unknown: string[];
			} = {
				chariots: [],
				dynamos: [],
				centurions: [],
				hurricanes: [],
				spartans: [],
				amazons: [],
				unknown: [],
			};

			members.sort((a, b) => {
				return a.nickname ? a.nickname.localeCompare(b.nickname) : 0;
			});

			members.forEach((member) => {
				if (member.roles.cache.has(ROLEIDS.chariots)) {
					tm.chariots.push(member.nickname);
				} else if (member.roles.cache.has(ROLEIDS.dynamos)) {
					tm.dynamos.push(member.nickname);
				} else if (member.roles.cache.has(ROLEIDS.centurions)) {
					tm.centurions.push(member.nickname);
				} else if (member.roles.cache.has(ROLEIDS.hurricanes)) {
					tm.hurricanes.push(member.nickname);
				} else if (member.roles.cache.has(ROLEIDS.spartans)) {
					tm.spartans.push(member.nickname);
				} else if (member.roles.cache.has(ROLEIDS.amazons)) {
					tm.amazons.push(member.nickname);
				} else {
					tm.unknown.push(member.nickname);
				}
			});

			const card = new EmbedBuilder().setTitle("Members").setDescription(
				`Here are the members:\n
				// get all the keys of the object

						${Object.keys(tm).map((key) => {
							return `**${key}**: ${tm[key].join(", ")}`;
						})}`
			);

			interaction.followUp({
				embeds: [card],
			});
		}
	},
};

export default debug;
