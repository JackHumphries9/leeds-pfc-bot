interface BotConfig {
	guildId: string;
	chariotId: string;
	dynamoId: string;
	amazonId: string;
	centurionId: string;
	spartanId: string;
	hurricaneId: string;
	moderatorId: string;
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
};

const configs: { [key: string]: BotConfig } = {
	dev: devConfig,
};

export default configs[stage];
