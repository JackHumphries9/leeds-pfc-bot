import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ColorResolvable,
	EmbedBuilder,
	SlashCommandBuilder,
} from "discord.js";
import config from "../config";
import { ICommandExecutable } from "../types/ICommandExecutable";
import niceDate from "../utils/niceDate";
import { firstDayOfWeek } from "../utils/temporal";

const rsvp: ICommandExecutable = {
	command: new SlashCommandBuilder()
		.setName("rsvp")
		.setDescription(
			"Shows the training sessions for the week with RSVP options"
		)
		.setDefaultMemberPermissions(0x8 | 0x20 | 0x200000000),
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

		global.calendar_cache.map((event) => {
			const meta = niceDate(
				new Date(event.start_dt),
				new Date(event.end_dt),
				event.all_day
			);

			interaction.channel.send({
				embeds: [
					new EmbedBuilder()
						.setColor(
							config.teamMap[event.subcalendar_ids[0]].colour ||
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
									config.teamMap[id.toString()]
										? config.teamMap[id.toString()].name
										: "Unknown"
								)
								.join(", ")}`,
						}),
				],
				components: [
					new ActionRowBuilder().addComponents(
						new ButtonBuilder()
							.setCustomId(`rsvp/${event.id}?ok`)
							.setLabel("I can attend!")
							.setStyle(ButtonStyle.Success),
						new ButtonBuilder()
							.setCustomId(`rsvp/${event.id}?notok`)
							.setLabel("I cannot attend!")
							.setStyle(ButtonStyle.Danger)
					) as any,
				],
			});
		});

		interaction.channel.send({
			embeds: [
				new EmbedBuilder()
					.setTitle("Training Sessions")
					.setDescription(
						`Here are the training sessions for this week (WC: ${firstDayOfWeek(
							new Date(),
							1
						).toLocaleDateString("en-GB", {
							dateStyle: "short",
						})}). Please RSVP to the ones you can attend.`
					)
					.setColor("#4aaace"),
			],
		});

		interaction.followUp({
			embeds: [
				new EmbedBuilder()
					.setTitle("RSVP")
					.setDescription("Command executed successfully")
					.setColor("#4aaace"),
			],
		});
	},
};

export default rsvp;
