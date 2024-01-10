import { Repository, SetAttendanceResponse } from "./repository";

import { IAttendance } from "../types/UtilTypes";
import {
	RedisClientType,
	RedisFunctions,
	RedisModules,
	RedisScripts,
} from "redis";
import { redisConnect } from "./redisConnect";
import config from "../config";
import { firstDayOfWeek } from "../utils/temporal";

export class RedisRepository extends Repository {
	updateDiscordEventId(
		eventId: string,
		newDiscordEventId: string
	): Promise<void> {
		throw new Error("Method not implemented.");
	}
	createEventDiscordEvent(
		eventId: string,
		discordEvent: string
	): Promise<void> {
		throw new Error("Method not implemented.");
	}
	getEventDiscordEvent(eventId: string): Promise<string> {
		throw new Error("Method not implemented.");
	}
	private db: RedisClientType<RedisModules, RedisFunctions, RedisScripts>;
	private readonly key =
		config.stage && config.stage === "prod"
			? "attendance"
			: "attendance-dev";

	constructor() {
		super();
		redisConnect().then((client) => {
			this.db = client;
		});
	}

	async clearAttendance(): Promise<void> {
		await this.db.set(this.key, "[]");
	}

	async getAttendanceFromEventId(eventId: string): Promise<IAttendance[]> {
		const attendanceStr = await this.db.get(this.key);

		if (!attendanceStr) {
			return [];
		}

		const attendance = JSON.parse(attendanceStr) as IAttendance[];
		return attendance.filter((a) => a.eventId === eventId);
	}

	async getEventAttendanceForUser(
		eventId: string,
		userId: string
	): Promise<IAttendance | undefined> {
		const attendanceStr = await this.db.get(this.key);

		if (!attendanceStr) {
			return undefined;
		}

		const attendance = JSON.parse(attendanceStr) as IAttendance[];
		return attendance.find(
			(a) => a.eventId === eventId && a.userId === userId
		);
	}

	async setAttendance(
		userId: string,
		eventId: string,
		attending: boolean
	): Promise<SetAttendanceResponse> {
		const attendanceStr = await this.db.get(this.key);

		let attendance: IAttendance[];

		if (!attendanceStr) {
			attendance = [];
		} else {
			attendance = JSON.parse(attendanceStr) as IAttendance[];
		}

		const update = attendance.findIndex(
			(a) => a.userId === userId && a.eventId === eventId
		);

		if (update !== -1) {
			attendance[update] = {
				...attendance[update],
				isAttending: attending,
			};
			await this.db.set(this.key, JSON.stringify(attendance));
			return { updated: true };
		}

		attendance.push({
			userId: userId,
			eventId: eventId,
			isAttending: attending,
			createdAt: Date.now(),
		});
		await this.db.set(this.key, JSON.stringify(attendance));

		return { updated: false };
	}

	async getAllAttendance(): Promise<IAttendance[]> {
		const attendanceStr = await this.db.get(this.key);

		if (!attendanceStr) {
			return [];
		}

		return JSON.parse(attendanceStr) as IAttendance[];
	}

	async clearOldAttendance(): Promise<void> {
		const attendanceStr = await this.db.get(this.key);

		if (!attendanceStr) {
			return;
		}

		const attendance = JSON.parse(attendanceStr) as IAttendance[];

		const newAttendance = attendance.filter(
			(a) => a.createdAt > firstDayOfWeek(new Date(), 1).getTime()
		);

		await this.db.set(this.key, JSON.stringify(newAttendance));
	}

	async getAttendanceForUser(userId: string): Promise<IAttendance[]> {
		const attendanceStr = await this.db.get(this.key);

		if (!attendanceStr) {
			return [];
		}

		const attendance = JSON.parse(attendanceStr) as IAttendance[];
		return attendance.filter((a) => a.userId === userId);
	}
}
