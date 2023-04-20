import { GuildMember } from "discord.js";

export const getNicknameOrUsername = (member: GuildMember) => {
	return member.nickname || member.user.username;
};
