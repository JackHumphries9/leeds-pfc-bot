import { ColorResolvable, EmbedBuilder } from "discord.js";
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

	const when = data.when ? `**Time**: ${data.when}\n` : "";

	const where = data.where ? `**At**: ${"`" + data.where + "`"}\n` : "";

	const forr = `**For**: ${data.for
		.map((id) =>
			config.eventMap[id.toString()]
				? config.eventMap[id.toString()].roleId.map(
						(r) => `<@&${r.toString()}>`
				  )
				: "Unknown"
		)
		.join(", ")}\n`;

	const notes = data.notes ? `**Notes**: ${data.notes}\n` : "";

	e.setTitle(
		data.title && data.title.length > 0 ? data.title : "Untitled Event"
	);

	e.setColor(data.color || "#4aaace");

	e.setDescription(`${when}${where}${notes}\n${forr}`);
	return e;
};

export default eventEmbedBuilder;
