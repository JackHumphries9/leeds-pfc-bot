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
	adminRoleIds: string[];
	welcomeChannelId: string;
	tdChannelId: string;
	logChannelId: string;
	verifyChannelId: string;
	verifyRoleId: string;
	stage: string;
	allowedExecutors: string[];
	playersRoleId: string;
}

export const stage = process.env.STAGE || "dev";

const prodRoleIds = {
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

export const ROLEIDS = stage == "prod" ? prodRoleIds : devRoleIds;

const devConfig: BotConfig = {
	guildId: "1070297374905352253",
	adminRoleIds: ["1070298227783520297"],
	welcomeChannelId: "1070297375400271954",
	tdChannelId: "1070832922539606057",
	logChannelId: "1089304285839380570",
	verifyChannelId: "1089639397785354421",
	verifyRoleId: "1089639719803044031",
	stage: "dev",
	allowedExecutors: ["1070294013778862080"],
	playersRoleId: "1127291056657010729",

	eventMap: {
		"11026484": {
			colour: teamUpColorToHex(2) as ColorResolvable,
			name: "Centurions",
			roleId: [ROLEIDS.centurions],
		},
		"11026483": {
			colour: teamUpColorToHex(36) as ColorResolvable,
			name: "Chariots",
			roleId: [ROLEIDS.chariots],
		},
		"11026445": {
			colour: teamUpColorToHex(15) as ColorResolvable,
			name: "Dynamos",
			roleId: [ROLEIDS.dynamos],
		},
		// 11029974: {
		// 	colour: teamUpColorToHex(24) as ColorResolvable,
		// 	name: "Events",
		// 	roleId: [
		// 		ROLEIDS.dynamos,
		// 		ROLEIDS.chariots,
		// 		ROLEIDS.centurions,
		// 		ROLEIDS.spartans,
		// 		ROLEIDS.hurricanes,
		// 		ROLEIDS.amazons,
		// 	],
		// },
		"11026485": {
			colour: teamUpColorToHex(26) as ColorResolvable,
			name: "Hurricanes",
			roleId: [ROLEIDS.hurricanes],
		},
		"11029973": {
			colour: teamUpColorToHex(6) as ColorResolvable,
			name: "North East/Yorkshire League",
			roleId: [
				ROLEIDS.dynamos,
				ROLEIDS.centurions,
				ROLEIDS.chariots,
				ROLEIDS.hurricanes,
			],
		},
		"11026444": {
			colour: teamUpColorToHex(19) as ColorResolvable,
			name: "Spartans/Amazons",
			roleId: [ROLEIDS.spartans, ROLEIDS.amazons],
		},
		"11029970": {
			colour: teamUpColorToHex(9) as ColorResolvable,
			name: "WFA National League",
			roleId: [ROLEIDS.dynamos, ROLEIDS.chariots],
		},
	},
};

const prodConfig: BotConfig = {
	guildId: "1064867500711497738",
	adminRoleIds: [
		"1064867500711497743", // Administrator
		"1064867500711497740", // Owner
		"1095340176399667220", // Comittee
		"1064893723714015332", // Coach
	],
	welcomeChannelId: "1064867501231575119",
	tdChannelId: "1073596981164904498",
	logChannelId: "1089303801351114814",
	verifyChannelId: "1089639549224882256",
	verifyRoleId: "1089639996690006078",
	stage: "prod",
	allowedExecutors: ["1070294013778862080"],
	playersRoleId: "1127270913512054965",

	eventMap: {
		"11026484": {
			colour: teamUpColorToHex(2) as ColorResolvable,
			name: "Centurions",
			roleId: [ROLEIDS.centurions],
		},
		"11026483": {
			colour: teamUpColorToHex(36) as ColorResolvable,
			name: "Chariots",
			roleId: [ROLEIDS.chariots],
		},
		"11026445": {
			colour: teamUpColorToHex(15) as ColorResolvable,
			name: "Dynamos",
			roleId: [ROLEIDS.dynamos],
		},
		//11029974: {
		//colour: teamUpColorToHex(24) as ColorResolvable,
		//name: "Events",
		//roleId: [
		// ROLEIDS.dynamos,
		// ROLEIDS.chariots,
		// ROLEIDS.centurions,
		// ROLEIDS.spartans,
		// ROLEIDS.hurricanes,
		// ROLEIDS.amazons,
		//],
		//},
		"11026485": {
			colour: teamUpColorToHex(26) as ColorResolvable,
			name: "Hurricanes",
			roleId: [ROLEIDS.hurricanes],
		},
		"11029973": {
			colour: teamUpColorToHex(6) as ColorResolvable,
			name: "North East/Yorkshire League",
			roleId: [
				ROLEIDS.dynamos,
				ROLEIDS.centurions,
				ROLEIDS.chariots,
				ROLEIDS.hurricanes,
			],
		},
		"11026444": {
			colour: teamUpColorToHex(19) as ColorResolvable,
			name: "Spartans/Amazons",
			roleId: [ROLEIDS.spartans, ROLEIDS.amazons],
		},
		"11029970": {
			colour: teamUpColorToHex(9) as ColorResolvable,
			name: "WFA National League",
			roleId: [ROLEIDS.dynamos, ROLEIDS.chariots],
		},
	},
};

const configs: { [key: string]: BotConfig } = {
	dev: devConfig,
	prod: prodConfig,
};

export default configs[stage];
