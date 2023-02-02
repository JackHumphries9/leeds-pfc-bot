import { ColorResolvable } from "discord.js";

export interface TeamConfig {
	teamupId: string;
	colour: string;
	roleId: string;
}

export interface BotConfig {
	teams: {
		[key: string]: TeamConfig;
	};
	colorMap: {
		[key: string]: { colour: ColorResolvable; name: string };
	};
	guildId: string;
	moderatorId: string;
}

const stage = process.env.STAGE || "dev";

const devConfig: BotConfig = {
	guildId: "1070297374905352253",
	moderatorId: "1070298227783520297",
	colorMap: {
		11026483: { colour: "#f6c811", name: "Chariots" },
		11026445: { colour: "#8763ca", name: "Dynamos" },
		11026484: { colour: "#cf2424", name: "Centurion" },
		11026485: { colour: "#2951b9", name: "Spartan" },
		11026486: { colour: "#5a8121", name: "Hurricane" },
		11026487: { colour: "#2951b9", name: "Spartan" },
	},
	teams: {
		chariots: {
			teamupId: "11026483",
			colour: "#f6c811",
			roleId: "1070297963928232016",
		},
		dynamos: {
			teamupId: "11026445",
			colour: "#8763ca",
			roleId: "1070298004772376696",
		},
		centurion: {
			teamupId: "11026484",
			colour: "#cf2424",
			roleId: "1070298047864643664",
		},
		spartan: {
			teamupId: "11026483",
			colour: "#2951b9",
			roleId: "1070298127942303754",
		},
		hurricane: {
			teamupId: "11026483",
			colour: "#5a8121",
			roleId: "1070298181767811092",
		},
		amazons: {
			teamupId: "11026483",
			colour: "#2951b9",
			roleId: "1070297928582844517",
		},
	},
};

const configs: { [key: string]: BotConfig } = {
	dev: devConfig,
};

export default configs[stage];
