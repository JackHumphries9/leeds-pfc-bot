import schedule from "node-schedule";
import { CronDays, TimingRule } from "../cronTiming";
import { Client, TextChannel } from "discord.js";
import { info } from "console";
import { logAction } from "../utils/logAction";
import fetchCalendarData from "../fetchCalendarData";
import config from "../config";
import { logError } from "../utils/logger";
import { showRSVP } from "../showRSVP";

export class CacheManager {
	private recurranceRule: schedule.RecurrenceRule;
	private ruleTiming: TimingRule = {
		dayOfWeek: CronDays.MONDAY,
		hour: 7,
		minute: 30,
	};
	private client: Client<boolean>;

	constructor(client: Client<boolean>) {
		this.recurranceRule = new schedule.RecurrenceRule();
		this.recurranceRule.dayOfWeek = this.ruleTiming.dayOfWeek;
		this.recurranceRule.hour = this.ruleTiming.hour;
		this.recurranceRule.minute = this.ruleTiming.minute;

		schedule.scheduleJob(this.recurranceRule, this.job);

		this.client = client;
	}

	public async job(): Promise<void> {
		info("Starting Cache Update Job");

		logAction("Starting Cache Update Job", this.client);

		global.calendar_cache = await fetchCalendarData();

		info("Cache refreshed");
		info("Finding channel");

		const ch = this.client.channels.cache.find(
			(c) => c.id === config.tdChannelId
		) as TextChannel;

		if (!ch) {
			logError("Channel not found");
			return;
		}

		// Clear channel
		info("Channel found - clearing");

		const messages = await ch.messages.fetch();
		messages.map((m) => m.delete());

		info("Channel cleared, sending new messages");

		showRSVP(ch).then(() => {
			info("Job complete");
		});
	}
}
