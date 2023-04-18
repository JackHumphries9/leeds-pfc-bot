import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	ColorResolvable,
	EmbedBuilder,
	TextChannel,
} from "discord.js";
import config from "./config";
import niceDate from "./utils/niceDate";
import { firstDayOfWeek } from "./utils/temporal";
import eventEmbedBuilder from "./utils/eventEmbedBuilder";
import { TimestampStyle, timestamp } from "discord-string-formatting";

export const showRSVP = async (channel: TextChannel) => {
	if (global.calendar_cache.length === 0) {
		const card = new EmbedBuilder()
			.setTitle("No Events Found!")
			.setColor("#4aaace")
			.setDescription(
				"There are no training sessions scheduled for this week."
			);

		await channel.send({
			embeds: [card],
		});
		return;
	}

	global.calendar_cache.map(async (event) => {
		const meta = await channel.send({
			embeds: [
				eventEmbedBuilder({
					title: event.title,
					color: config.eventMap[event.subcalendar_ids[0]].colour,
					for: event.subcalendar_ids,
					notes: event.notes,
					when: niceDate(
						new Date(event.start_dt),
						new Date(event.end_dt),
						event.all_day
					),
					where: event.location,
				}),
			],
			components: [
				// Actions for each event
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
	await channel.send({
		embeds: [
			new EmbedBuilder()
				.setTitle("Training Sessions")
				.setDescription(
					`Here are the training sessions for this week (WC: ${timestamp(
						firstDayOfWeek(new Date(), 1),
						TimestampStyle.ShortDate
					)}. Please RSVP to the ones you can attend.`
				)
				.setColor("#4aaace"),
		],
		components: [
			// Bottom actions
			new ActionRowBuilder().addComponents(
				new ButtonBuilder()
					.setCustomId(`command/mytraining`)
					.setLabel("My Training")
					.setStyle(ButtonStyle.Primary),
				new ButtonBuilder()
					.setCustomId(`command/attendance`)
					.setLabel("Show Attendance")
					.setStyle(ButtonStyle.Secondary)
			) as any,
		],
	});
};
