import { ICommandExecutable } from "./ICommandExecutable";
import { TeamUpEvent } from "./TeamUpEvent";

export interface Attendance {
	userId: string;
	attending: boolean;
	eventId: string;
}
declare global {
	var calendar_cache: TeamUpEvent[];
	var commands: { [key: string]: ICommandExecutable };
	var attendance: Attendance[];
}
