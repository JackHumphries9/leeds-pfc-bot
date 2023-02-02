export interface TeamConfig {
	teamupId: string;
	colour: string;
	roleId: string;
}

export interface BotConfig {
	teams: {
		[key: string]: TeamConfig;
	};
	guildId: string;
	moderatorId: string;
}

const stage = process.env.STAGE || "dev";

const devConfig: BotConfig = {
	guildId: "1070297374905352253",
	moderatorId: "1070298227783520297",
	teams: {
		chariots: {
			teamupId: "11026483",
			colour: "#f6c811",
			roleId: "1070297963928232016",
		},
		dynamos: {
			teamupId: "11026483",
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
