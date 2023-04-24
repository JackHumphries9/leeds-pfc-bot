import { Repository } from "./repository";

import { Attendance } from "../types/UtilTypes";
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

	async getAttendanceFromEventId(eventId: string): Promise<Attendance[]> {
		const attendanceStr = await this.db.get(this.key);

		if (!attendanceStr) {
			return [];
		}

		const attendance = JSON.parse(attendanceStr) as Attendance[];
		return attendance.filter((a) => a.eventId === eventId);
	}

	async getEventAttendanceForUser(
		eventId: string,
		userId: string
	): Promise<Attendance> {
		const attendanceStr = await this.db.get(this.key);

		if (!attendanceStr) {
			return undefined;
		}

		const attendance = JSON.parse(attendanceStr) as Attendance[];
		return attendance.find(
			(a) => a.eventId === eventId && a.userId === userId
		);
	}

	async setAttendance(
		userId: string,
		eventId: string,
		attending: boolean
	): Promise<{ updated: boolean }> {
		const attendanceStr = await this.db.get(this.key);

		let attendance: Attendance[];

		if (!attendanceStr) {
			attendance = [];
		} else {
			attendance = JSON.parse(attendanceStr) as Attendance[];
		}

		const update = attendance.findIndex(
			(a) => a.userId === userId && a.eventId === eventId
		);

		if (update !== -1) {
			attendance[update] = {
				...attendance[update],
				attending: attending,
			};
			await this.db.set(this.key, JSON.stringify(attendance));
			return { updated: true };
		}

		attendance.push({
			userId: userId,
			eventId: eventId,
			attending: attending,
			at: Date.now(),
		});
		await this.db.set(this.key, JSON.stringify(attendance));

		return { updated: false };
	}

	async getAllAttendance(): Promise<Attendance[]> {
		const attendanceStr = await this.db.get(this.key);

		if (!attendanceStr) {
			return [];
		}

		const attendance = JSON.parse(attendanceStr) as Attendance[];

		return attendance;
	}

	async clearOldAttendance(): Promise<void> {
		const attendanceStr = await this.db.get(this.key);

		if (!attendanceStr) {
			return;
		}

		const attendance = JSON.parse(attendanceStr) as Attendance[];

		const now = Date.now();

		const newAttendance = attendance.filter(
			(a) => a.at > firstDayOfWeek(new Date(), 1).getTime()
		);

		await this.db.set(this.key, JSON.stringify(newAttendance));
	}
}
