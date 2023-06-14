import {
	ButtonInteraction,
	CacheType,
	EmbedBuilder,
	GuildMemberRoleManager,
} from "discord.js";
import config from "../config";
import { logAction } from "../utils/logAction";
import { debug } from "../utils/logger";

const handleRSVP = async (
	interaction: ButtonInteraction<CacheType>
): Promise<any> => {
	await interaction.deferReply({ ephemeral: true });

	// get last part of customId
	const states = interaction.customId.split("?");
	const state = states[states.length - 1];

	const idsplt = interaction.customId.split("?")[0].split("/");
	const id = idsplt[idsplt.length - 1];

	const calendarEvent = global.calendar_cache.find((e) => e.id === id);

	debug(`state: ${state}, id: ${id}, customId: ${interaction.customId}`);

	if (!calendarEvent) {
		return interaction.followUp({
			ephemeral: true,
			embeds: [
				new EmbedBuilder()
					.setTitle("Error!")
					.setColor("#f44336")
					.setDescription("Cannot find that event in the calendar."),
			],
		});
	}

	var canRSVP = false;

	calendarEvent.subcalendar_ids.forEach((id) => {
		if (
			(interaction.member.roles as GuildMemberRoleManager).cache.find(
				(role) =>
					config.eventMap[id.toString()].roleId.includes(
						role.id.toString()
					)
			)
		) {
			canRSVP = true;
		}
	});

	if (!canRSVP) {
		return interaction.followUp({
			ephemeral: true,
			embeds: [
				new EmbedBuilder()
					.setTitle("Not a member of this team")
					.setColor("#f44336")
					.setDescription("You cannot RSVP to this event."),
			],
		});
	}

	const att = state === "ok" ? true : state === "notok" ? false : null;

	if (att === null) {
		throw new Error("Invalid state");
	}

	const dbUpdate = await global.repository.setAttendance(
		interaction.user.id,
		id,
		att
	);

	debug(`${dbUpdate.updated}`);

	// a good hex color for soft red is #f44336

	if (!dbUpdate.updated) {
		if (att) {
			logAction(
				`${interaction.user.tag} Set their attendance to **attending** for ${calendarEvent.title}`,
				interaction.client
			);
		} else {
			logAction(
				`${interaction.user.tag} Set their attendance to **not attending** for ${calendarEvent.title}`,
				interaction.client
			);
		}

		return interaction.followUp({
			ephemeral: true,
			embeds: [
				new EmbedBuilder()
					.setTitle("RSVP")
					.setColor("#4caf50")
					.setDescription(
						`${
							att ? "You are attending" : "You are not attending"
						}: ${calendarEvent.title}!`
					),
			],
		});
	} else {
		if (att) {
			logAction(
				`${interaction.user.tag} Updated their attendance to **attending** for ${calendarEvent.title}`,
				interaction.client
			);
		} else {
			logAction(
				`${interaction.user.tag} Updated their attendance to **not attending** for ${calendarEvent.title}`,
				interaction.client
			);
		}

		await interaction.followUp({
			ephemeral: true,
			embeds: [
				new EmbedBuilder()
					.setTitle("RSVP")
					.setColor("#4caf50")
					.setDescription(
						`Your attendance has been updated! ${
							att
								? "You are now attending"
								: "You are now not attending"
						}: ${calendarEvent.title}!`
					),
			],
		});
	}
};
export { handleRSVP };
