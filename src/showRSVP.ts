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
		const meta = niceDate(
			new Date(event.start_dt),
			new Date(event.end_dt),
			event.all_day
		);
		await channel.send({
			embeds: [
				new EmbedBuilder()
					.setColor(
						config.eventMap[event.subcalendar_ids[0]].colour ||
							("#4aaace" as ColorResolvable)
					)
					.setTitle(event.title)
					.setDescription(
						`**Time**: ${meta}
${
	event.notes.length > 1 ? `**Notes**: ${event.notes}\n\n	` : "  "
}**For:** ${event.subcalendar_ids
							.map((id) =>
								config.eventMap[id.toString()]
									? config.eventMap[id.toString()].roleId.map(
											(r) => `<@&${r.toString()}>`
									  )
									: "Unknown"
							)
							.join(", ")}`
					),
				// .setFooter({
				// 	text: `For: ${event.subcalendar_ids
				// 		.map((id) =>
				// 			config.eventMap[id.toString()]
				// 				? config.eventMap[id.toString()].name
				// 				: "Unknown"
				// 		)
				// 		.join(", ")}`,
				// }),
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
	await channel.send({
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
		components: [
			new ActionRowBuilder().addComponents(
				new ButtonBuilder()
					.setCustomId(`command/attendance`)
					.setLabel("Show Attendance")
					.setStyle(ButtonStyle.Secondary)
			) as any,
		],
	});
};
