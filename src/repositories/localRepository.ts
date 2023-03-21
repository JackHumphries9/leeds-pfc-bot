import { Repository } from "./repository";

import { Attendance } from "../types/UtilTypes";
import { debug } from "../utils/logger";

export class LocalRepository extends Repository {
	private db: Attendance[];

	constructor() {
		super();
		this.db = [];
	}

	async clearAttendance(): Promise<void> {
		this.db = [];
	}

	async getAttendanceFromEventId(eventId: string): Promise<Attendance[]> {
		return this.db.filter((a) => a.eventId === eventId);
	}

	async getEventAttendanceForUser(
		eventId: string,
		userId: string
	): Promise<Attendance> {
		return this.db.find(
			(a) => a.eventId === eventId && a.userId === userId
		);
	}

	async setAttendance(
		userId: string,
		eventId: string,
		attending: boolean
	): Promise<{ updated: boolean }> {
		const update = this.db.findIndex(
			(a) => a.userId === userId && a.eventId === eventId
		);

		if (update !== -1) {
			this.db[update] = {
				...this.db[update],
				attending: attending,
			};
			return { updated: true };
		}

		this.db.push({
			userId: userId,
			eventId: eventId,
			attending: attending,
		});
		debug(JSON.stringify(this.db));

		return { updated: false };
	}

	async getAllAttendance(): Promise<Attendance[]> {
		return this.db;
	}
}
