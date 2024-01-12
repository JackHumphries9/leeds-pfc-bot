import { GuildMember } from "discord.js";

export const getNicknameOrUsername = (member?: GuildMember) => {
	if (!member) return "Unknown";

	return member.nickname || member.user.username;
};
