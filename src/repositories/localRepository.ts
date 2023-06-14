import {Repository, SetAttendanceResponse} from "./repository";

import { IAttendance } from "../types/UtilTypes";
import { debug } from "../utils/logger";
import { firstDayOfWeek } from "../utils/temporal";

export class LocalRepository extends Repository {
	private db: IAttendance[];

	constructor() {
		super();
		this.db = [];
	}

	async clearAttendance(): Promise<void> {
		this.db = [];
	}

	async getAttendanceFromEventId(eventId: string): Promise<IAttendance[]> {
		return this.db.filter((a) => a.eventId === eventId);
	}

	async getEventAttendanceForUser(
		eventId: string,
		userId: string
	): Promise<IAttendance | undefined> {
		return this.db.find(
			(a) => a.eventId === eventId && a.userId === userId
		);
	}

	async setAttendance(
		userId: string,
		eventId: string,
		attending: boolean
	): Promise<SetAttendanceResponse> {
		const update = this.db.findIndex(
			(a) => a.userId === userId && a.eventId === eventId
		);

		if (update !== -1) {
			this.db[update] = {
				...this.db[update],
				isAttending: attending,
				updatedAt: Date.now()
			};
			return { updated: true };
		}

		this.db.push({
			userId: userId,
			eventId: eventId,
			isAttending: attending,
			createdAt: Date.now(),
		});
		debug(JSON.stringify(this.db));

		return { updated: false };
	}

	async getAllAttendance(): Promise<IAttendance[]> {
		return this.db;
	}

	async clearOldAttendance(): Promise<void> {
		this.db = this.db.filter(
			(a) => a.createdAt < firstDayOfWeek(new Date(), 1).getTime()
		);
	}
}
