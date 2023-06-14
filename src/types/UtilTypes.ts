import { Job } from "node-schedule";
import { RedisFunctions, RedisModules, RedisScripts } from "redis";
import { RedisClientType } from "redis";
import { Repository } from "../repositories/repository";
import { ICommandExecutable } from "./ICommandExecutable";
import { TeamUpEvent } from "./TeamUpEvent";

export interface IAttendance {
	userId: string;
	isAttending: boolean;
	eventId: string;
	createdAt?: number;
	updatedAt?: number;
}
declare global {
	var calendar_cache: TeamUpEvent[];
	var commands: { [key: string]: ICommandExecutable };
	var redis: RedisClientType<RedisModules, RedisFunctions, RedisScripts>;
	var repository: Repository;
	var job: Job;
}
