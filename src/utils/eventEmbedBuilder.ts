import {  EmbedBuilder, bold } from "discord.js";
import config from "../config";

interface IEventEmbedBuilderData {
	title: string;
	where?: string;
	when?: string;
	for: string[];
	notes?: string;
	body?: string;
}

const eventEmbedBuilder = (data: IEventEmbedBuilderData): EmbedBuilder => {
	const e = new EmbedBuilder();

	const when = data.when ? `${bold("Time")}: ${data.when}\n` : "";

	const where = data.where
		? `${bold("At")}: ${"`" + data.where + "`"}\n`
		: "";

	const forr = `${bold("For")}: ${data.for
		.map((id) =>
			config.eventMap[id.toString()]
				? config.eventMap[id.toString()].roleId.map(
						(r) => `<@&${r.toString()}>`
				  )
				: "Unknown"
		)
		.join(", ")}\n`;

	const notes = data.notes ? `${bold("Notes")}: ${data.notes}\n` : "";

	e.setTitle(
		data.title && data.title.length > 0 ? data.title : "Untitled Event"
	);

	if (Object.keys(config.eventMap).includes(data.for[0].toString())) {
		e.setColor(config.eventMap[data.for[0].toString()].colour || "#4aaace");
	} else {
		e.setColor("#4aaace");
	}

	const body = data.body ? "\n" + data.body : "";

	e.setDescription(`${when}${where}${notes}\n${forr}${body}`);
	return e;
};

export default eventEmbedBuilder;
