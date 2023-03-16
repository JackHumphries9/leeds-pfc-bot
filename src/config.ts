import { ColorResolvable } from "discord.js";
import { teamUpColorToHex } from "./utils/teamUpColorToHex";

export interface TeamConfig {
	teamupId: string;
	colour: string;
	roleId: string;
}

export interface BotConfig {
	eventMap: {
		[key: string]: {
			colour: ColorResolvable;
			name: string;
			roleId: string[];
		};
	};
	guildId: string;
	adminRoleId: string;
	welcomeChannelId: string;
}

const stage = process.env.STAGE || "dev";

const roleIds = {
	centurions: "1064872566067568651",
	chariots: "1064871845398069258",
	dynamos: "1064872253319295057",
	spartans: "1064931662145794128",
	hurricanes: "1064932406932549834",
	amazons: "1064931865523392563",
};

const devRoleIds = {
	centurions: "1070298047864643664",
	chariots: "1070297963928232016",
	dynamos: "1070298004772376696",
	spartans: "1070298127942303754",
	hurricanes: "1070298181767811092",
	amazons: "1070297928582844517",
};

const devConfig: BotConfig = {
	guildId: "1070297374905352253",
	adminRoleId: "1070298227783520297",
	welcomeChannelId: "1070297375400271954",

	eventMap: {
		11026484: {
			colour: teamUpColorToHex(2) as ColorResolvable,
			name: "Centurions",
			roleId: [devRoleIds.centurions],
		},
		11026483: {
			colour: teamUpColorToHex(36) as ColorResolvable,
			name: "Chariots",
			roleId: [devRoleIds.chariots],
		},
		11026445: {
			colour: teamUpColorToHex(15) as ColorResolvable,
			name: "Dynamos",
			roleId: [devRoleIds.dynamos],
		},
		11029974: {
			colour: teamUpColorToHex(24) as ColorResolvable,
			name: "Events",
			roleId: [
				devRoleIds.dynamos,
				devRoleIds.chariots,
				devRoleIds.centurions,
				devRoleIds.spartans,
				devRoleIds.hurricanes,
				devRoleIds.amazons,
			],
		},
		11026485: {
			colour: teamUpColorToHex(26) as ColorResolvable,
			name: "Hurricanes",
			roleId: [devRoleIds.hurricanes],
		},
		11029973: {
			colour: teamUpColorToHex(6) as ColorResolvable,
			name: "North East/Yorkshire League",
			roleId: [
				devRoleIds.dynamos,
				devRoleIds.centurions,
				devRoleIds.chariots,
				devRoleIds.hurricanes,
			],
		},
		11026444: {
			colour: teamUpColorToHex(19) as ColorResolvable,
			name: "Spartans/Amazons",
			roleId: [devRoleIds.spartans, devRoleIds.amazons],
		},
		11029970: {
			colour: teamUpColorToHex(9) as ColorResolvable,
			name: "WFA National League",
			roleId: [devRoleIds.dynamos, devRoleIds.chariots],
		},
	},
};

const prodConfig: BotConfig = {
	guildId: "1064867500711497738",
	adminRoleId: "1064867500711497743",
	welcomeChannelId: "1064867501231575119",

	eventMap: {
		11026484: {
			colour: teamUpColorToHex(2) as ColorResolvable,
			name: "Centurions",
			roleId: [roleIds.centurions],
		},
		11026483: {
			colour: teamUpColorToHex(36) as ColorResolvable,
			name: "Chariots",
			roleId: [roleIds.chariots],
		},
		11026445: {
			colour: teamUpColorToHex(15) as ColorResolvable,
			name: "Dynamos",
			roleId: [roleIds.dynamos],
		},
		11029974: {
			colour: teamUpColorToHex(24) as ColorResolvable,
			name: "Events",
			roleId: [
				roleIds.dynamos,
				roleIds.chariots,
				roleIds.centurions,
				roleIds.spartans,
				roleIds.hurricanes,
				roleIds.amazons,
			],
		},
		11026485: {
			colour: teamUpColorToHex(26) as ColorResolvable,
			name: "Hurricanes",
			roleId: [roleIds.hurricanes],
		},
		11029973: {
			colour: teamUpColorToHex(6) as ColorResolvable,
			name: "North East/Yorkshire League",
			roleId: [
				roleIds.dynamos,
				roleIds.centurions,
				roleIds.chariots,
				roleIds.hurricanes,
			],
		},
		11026444: {
			colour: teamUpColorToHex(19) as ColorResolvable,
			name: "Spartans/Amazons",
			roleId: [roleIds.spartans, roleIds.amazons],
		},
		11029970: {
			colour: teamUpColorToHex(9) as ColorResolvable,
			name: "WFA National League",
			roleId: [roleIds.dynamos, roleIds.chariots],
		},
	},
};

const configs: { [key: string]: BotConfig } = {
	dev: devConfig,
	prod: prodConfig,
};

export default configs[stage];
