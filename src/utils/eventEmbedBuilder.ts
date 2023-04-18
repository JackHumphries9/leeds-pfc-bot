import { ColorResolvable, EmbedBuilder, bold } from "discord.js";
import config from "../config";

interface IEventEmbedBuilderData {
	title: string;
	color?: ColorResolvable;
	where?: string;
	when?: string;
	for: string[];
	notes?: string;
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

	e.setColor(data.color || "#4aaace");

	e.setDescription(`${when}${where}${notes}\n${forr}`);
	return e;
};

export default eventEmbedBuilder;
