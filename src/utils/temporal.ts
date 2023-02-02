const firstDayOfWeek = (
	dateObject: Date,
	firstDayOfWeekIndex: number
): Date => {
	const dayOfWeek = dateObject.getDay(),
		firstDayOfWeek = new Date(dateObject),
		diff =
			dayOfWeek >= firstDayOfWeekIndex
				? dayOfWeek - firstDayOfWeekIndex
				: 6 - dayOfWeek;

	firstDayOfWeek.setDate(dateObject.getDate() - diff);
	firstDayOfWeek.setHours(0, 0, 0, 0);

	return firstDayOfWeek;
};

const lastDayOfWeek = (dateObject: Date, lastDayOfWeekIndex: number): Date => {
	const dayOfWeek = dateObject.getDay(),
		lastDay = new Date(dateObject),
		diff = (lastDayOfWeekIndex + (7 - dateObject.getDay())) % 7;
	lastDay.setDate(dateObject.getDate() + diff);
	lastDay.setHours(23, 59, 59, 59);
	return lastDay;
};

const dateToTeamUpFormat = (dateObject: Date): string => {
	return `${dateObject.getFullYear()}-${
		dateObject.getMonth() + 1
	}-${dateObject.getDate()}`;
};

export { firstDayOfWeek, lastDayOfWeek, dateToTeamUpFormat };
