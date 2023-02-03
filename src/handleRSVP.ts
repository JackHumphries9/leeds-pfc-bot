import { ButtonInteraction, CacheType, EmbedBuilder } from "discord.js";
import config from "./config";
import { attendance } from "./services/attendance";
import { debug } from "./utils/logger";

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
			//@ts-ignore
			interaction.member.roles.cache.find(
				(role) =>
					role.id.toString() === config.teamMap[id.toString()].roleId
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

	const dbUpdate = await attendance(interaction.user.id, id, att);

	debug(`${dbUpdate.updated}`);

	// a good hex color for soft red is #f44336

	if (!dbUpdate.updated) {
		return interaction.followUp({
			ephemeral: true,
			embeds: [
				new EmbedBuilder()
					.setTitle("RSVP")
					.setColor(att ? "#4caf50" : "#f44336")
					.setDescription(
						`${att ? "Your attending" : "Your not attending"}: ${
							calendarEvent.title
						}!`
					),
			],
		});
	} else {
		interaction.followUp({
			ephemeral: true,
			embeds: [
				new EmbedBuilder()
					.setTitle("RSVP")
					.setColor(att ? "#4caf50" : "#f44336")
					.setDescription(
						`Your attendance has been updated! ${
							att
								? "Your now attending"
								: "Your now not attending"
						}: ${calendarEvent.title}!`
					),
			],
		});
	}
};
export { handleRSVP };
