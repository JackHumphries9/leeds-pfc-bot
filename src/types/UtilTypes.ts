import { ICommandExecutable } from "./ICommandExecutable";
import { TeamUpEvent } from "./TeamUpEvent";

declare global {
	var calendar_cache: TeamUpEvent[];
	var commands: { [key: string]: ICommandExecutable };
}
