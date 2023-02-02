export type EventVisibility = "all_users" | "users_with_modify_permission";

export interface TeamUpEvent {
	id: string;
	subcalendar_ids: string[];
	subcalendar_remote_ids: string[];
	start_dt: string;
	end_dt: string;
	all_day: boolean;
	rrule: string;
	notes: string;
	creation_dt: string;
	update_dt: string;
	delete_dt: string;
	tz: string;
	version: string;
	remote_id: string;
	series_id: number;
	ristart_dt: string;
	rsstart_dt: string;
	attachments: EventAttachment[];
	title: string;
	location: string;
	who: string;
	readonly: boolean;
	signup_enabled: boolean;
	signup_deadline: string;
	signup_visibility: EventVisibility;
	signup_limit: number;
	comments_enabled: boolean;
	comments_visibility: EventVisibility;
	custom: { [key: string]: string | string[] };
	comments: EventComments[];
	signups: EventSignups[];
}

export interface EventAttachment {
	id: string;
	name: string;
	size: number;
	mimetype: string;
	link: string;
	thumbnail: string;
	upload_date: string;
	preview: string;
}

export interface EventComments {
	id: string;
	event_id: string;
	name: string;
	email: string;
	message: string;
	remote_id: string;
	creation_dt: string;
	update_dt: string;
	updater: string;
}

export interface EventSignups {
	id: string;
	event_id: string;
	name: string;
	email: string;
	remote_id: string;
	creation_dt: string;
	update_dt: string;
	email_hash: string;
}
