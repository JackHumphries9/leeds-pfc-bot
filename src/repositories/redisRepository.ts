import { Repository } from "./repository";

import { Attendance } from "../types/UtilTypes";
import {
	RedisClientType,
	RedisFunctions,
	RedisModules,
	RedisScripts,
} from "redis";
import { redisConnect } from "./redisConnect";

export class LocalRepository extends Repository {
	private db: RedisClientType<RedisModules, RedisFunctions, RedisScripts>;

	constructor() {
		super();
		redisConnect().then((client) => {
			this.db = client;
		});
	}

	async clearAttendance(): Promise<void> {
		this.db.flushDb();
	}

	async getAttendanceFromEventId(eventId: string): Promise<Attendance[]> {
		throw new Error("Method not implemented.");
	}

	async getEventAttendanceForUser(
		eventId: string,
		userId: string
	): Promise<Attendance> {
		throw new Error("Method not implemented.");
	}

	async setAttendance(
		userId: string,
		eventId: string,
		attending: boolean
	): Promise<{ updated: boolean }> {
		throw new Error("Method not implemented.");
	}
}
