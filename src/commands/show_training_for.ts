import { ColorResolvable, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import config from "../config";
import { ICommandExecutable } from "../types/ICommandExecutable";
import niceDate from "../utils/niceDate";

const show_training_for: ICommandExecutable = {
	command: new SlashCommandBuilder()
		.setName("show-training-for")
		.setDescription("Shows your training sessions for the week")
		.addRoleOption((option) =>
			option
				.setName("team")
				.setDescription("The team to show training for")
				.setRequired(true)
		) as any,

	execute: async (interaction) => {
		await interaction.deferReply({ ephemeral: true });

		if (
			!interaction.memberPermissions.has("Administrator") ||
			!interaction.memberPermissions.has("ManageGuild")
		) {
			interaction.followUp({
				embeds: [
					new EmbedBuilder()
						.setTitle("Error!")
						.setColor("#FF0000")
						.setDescription(
							"You do not have the required permissions to run this command."
						),
				],
			});
			return;
		}

		//@ts-ignore
		const teamId = interaction.options.getRole("team").id;

		if (!global.calendar_cache) {
			const card = new EmbedBuilder()
				.setTitle("Error!")
				.setColor("#FF0000")
				.setDescription(
					"Failed to show the calendar. Please try again later or use the `/refresh-cache` command."
				);

			interaction.followUp({
				embeds: [card],
			});
			return;
		}

		if (global.calendar_cache.length === 0) {
			const card = new EmbedBuilder()
				.setTitle("No Events Found!")
				.setColor("#4aaace")
				.setDescription(
					"There are no training sessions scheduled for this week."
				);

			interaction.followUp({
				embeds: [card],
			});
			return;
		}

		const embeds = global.calendar_cache
			.map((event) => {
				var shouldShow = false;
				event.subcalendar_ids.forEach((id) => {
					if (
						config.eventMap[id.toString()].roleId ===
						teamId.toString()
					) {
						shouldShow = true;
					}
				});

				if (shouldShow === false) {
					return;
				}

				const meta = niceDate(
					new Date(event.start_dt),
					new Date(event.end_dt),
					event.all_day
				);

				return new EmbedBuilder()
					.setColor(
						config.eventMap[event.subcalendar_ids[0]].colour ||
							("#4aaace" as ColorResolvable)
					)
					.setTitle(event.title)
					.setDescription(
						`**Time**: ${meta}
${event.notes.length > 1 ? `**Notes**: ${event.notes}` : "  "}`
					)
					.setFooter({
						text: `For: ${event.subcalendar_ids
							.map((id) =>
								config.eventMap[id.toString()]
									? config.eventMap[id.toString()].name
									: null
							)
							.filter((i) => i)
							.join(", ")}`,
					});
			})
			.filter((event) => event);

		if (embeds.length === 0) {
			const card = new EmbedBuilder()
				.setTitle("No Events Found!")
				.setColor("#4aaace")
				.setDescription(
					"There are no training sessions scheduled for this week."
				);

			interaction.followUp({
				embeds: [card],
			});
			return;
		}

		interaction.followUp({
			embeds: embeds,
		});

		//await interaction.reply("Pong!");
	},
};

export default show_training_for;
