import schedule from "node-schedule";
import { CronDays, TimingRule } from "../cronTiming";
import {
	ActionRowBuilder,
	ButtonBuilder,
	ButtonStyle,
	Client,
	EmbedBuilder,
	GuildMember,
	GuildMemberRoleManager,
} from "discord.js";
import config from "../config";
import { IAttendance } from "../types/UtilTypes";
import { TeamUpEvent } from "../types/TeamUpEvent";
import { debug, info } from "../utils/logger";

interface NotificationEventState {
	canSendNotification: boolean;
	eventsToAcknowledge: string[];
}

export class NotificationManager {
	private recurranceRule: schedule.RecurrenceRule;
	private ruleTiming: TimingRule = {
		dayOfWeek: CronDays.TUESDAY,
		hour: 12,
		minute: 0,
	};
	private scheduledJob: schedule.Job;

	constructor(client: Client<boolean>) {
		client = client;

		this.recurranceRule = new schedule.RecurrenceRule();
		this.recurranceRule.dayOfWeek = this.ruleTiming.dayOfWeek;
		this.recurranceRule.hour = this.ruleTiming.hour;
		this.recurranceRule.minute = this.ruleTiming.minute;

		this.scheduledJob = schedule.scheduleJob(this.recurranceRule, () => {
			this.job(client);
		});
	}

	public async invoke(): Promise<void> {
		this.scheduledJob.invoke();
	}

	public async job(client: Client<boolean>): Promise<void> {
		info("Notification job triggered!");

		// get guild
		const guild = await client.guilds.fetch(config.guildId);

		// get all users
		const members = await guild.members.fetch();

		members.forEach((member) => {
			if (
				member.roles.cache.has(config.playersRoleId) &&
				!member.user.bot
			) {
				this.sendNotification(client, member);
			}
		});

		info("Job complete");
	}

	private async canSendNotification(
		client: Client<boolean>,
		user: GuildMember
	): Promise<NotificationEventState> {
		const usersAttendance = await global.repository.getAttendanceForUser(
			user.id
		);

		let availableEvents: TeamUpEvent[] = [];
		let eventsAcknowledged: string[] = [];

		global.calendar_cache.forEach((event) => {
			let isInvolved = false;

			event.subcalendar_ids.forEach((id) => {
				if (
					(user.roles as GuildMemberRoleManager).cache.find(
						(role) => {
							if (config.eventMap[id.toString()]) {
								return config.eventMap[
									id.toString()
								].roleId.includes(role.id.toString());
							}
						}
					)
				) {
					isInvolved = true;
				}
			});

			if (isInvolved) {
				availableEvents.push(event);
				if (usersAttendance.find((a) => a.eventId === event.id)) {
					eventsAcknowledged.push(event.id);
				}
			}
		});

		let eventsToAcknowledge: string[] = availableEvents
			.filter((event) => {
				return !eventsAcknowledged.includes(event.id);
			})
			.map((event) => event.title ?? "Untitled Event");

		return {
			canSendNotification:
				availableEvents.length > eventsAcknowledged.length,
			eventsToAcknowledge: eventsToAcknowledge,
		};
	}

	private async sendNotification(
		client: Client<boolean>,
		user: GuildMember
	): Promise<void> {
		const notificationState = await this.canSendNotification(client, user);

		if (!notificationState.canSendNotification) {
			return;
		}

		const eventsToAcknowledge =
			notificationState.eventsToAcknowledge.join("\n- ");

		const notificationMessage = new EmbedBuilder()
			.setTitle("Reminder!")
			.setColor("#256fb8")
			.setThumbnail("https://jackh.club/leedspfc/logo_nobg.png")
			.setDescription(
				`You haven't confirmed your attendance yet for these events: \n- ${eventsToAcknowledge}\nPlease click the button below to go to the #training-dates channel.`
			);

		debug("Sending notification to " + user.user.username);

		// await user.send({
		// 	embeds: [notificationMessage],
		// 	components: [
		// 		new ActionRowBuilder<ButtonBuilder>().addComponents(
		// 			new ButtonBuilder()
		// 				.setStyle(ButtonStyle.Link)
		// 				.setURL(
		// 					"https://discord.com/channels/1064867500711497738/1073596981164904498"
		// 				)
		// 				.setLabel("Training Dates")
		// 				.setEmoji("📅")
		// 		),
		// 	],
		// });
	}
}
