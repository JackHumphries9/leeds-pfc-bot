export enum CronDays {
	SUNDAY = 0,
	MONDAY = 1,
	TUESDAY = 2,
	WEDNESDAY = 3,
	THURSDAY = 4,
	FRIDAY = 5,
	SATURDAY = 6,
}

export interface TimingRule {
	dayOfWeek: CronDays;
	hour: number;
	minute: number;
}
