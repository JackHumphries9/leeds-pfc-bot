interface CalendarConfig {
	id: string;
	color: string;
}

interface BotConfig {
	guildId: string;
	chariotId: string;
	dynamoId: string;
	amazonId: string;
	centurionId: string;
	spartanId: string;
	hurricaneId: string;
	moderatorId: string;
	calendars: {
		chariot: CalendarConfig;
		dynamo: CalendarConfig;
		amazon: CalendarConfig;
		centurion: CalendarConfig;
		spartan: CalendarConfig;
		hurricane: CalendarConfig;
	};
}

const stage = process.env.STAGE || "dev";

const devConfig: BotConfig = {
	guildId: "1070297374905352253",
	amazonId: "1070297928582844517",
	chariotId: "1070297963928232016",
	dynamoId: "1070298004772376696",
	centurionId: "1070298047864643664",
	spartanId: "1070298127942303754",
	hurricaneId: "1070298181767811092",
	moderatorId: "1070298227783520297",
	calendars: {
		centurion: {
			id: "11026484",
			color: "#cf2424",
		},
		chariot: {
			id: "11026483",
			color: "#f6c811",
		},
		amazon: {
			color: "#2951b9",
			id: "11026444",
		},
		dynamo: {
			color: "#8763ca",
			id: "11026445",
		},
		hurricane: {
			id: "11026485",
			color: "#5a8121",
		},
		spartan: {
			color: "#2951b9",
			id: "11026444",
		},
	},
};

const configs: { [key: string]: BotConfig } = {
	dev: devConfig,
};

export default configs[stage];
