import { timestamp, TimestampStyle } from "discord-string-formatting";

const niceDate = (start: Date, end: Date, all_day?: boolean) => {
	if (start.getDay() === end.getDay()) {
		if (all_day) {
			return `${timestamp(start, TimestampStyle.LongDate)}`;
		}
		return `${timestamp(
			start,
			TimestampStyle.LongDateTime
		)} till ${timestamp(end, TimestampStyle.ShortTime)}`;
	}
	if (all_day) {
		return `${timestamp(start, TimestampStyle.LongDate)} till ${timestamp(
			end,
			TimestampStyle.LongDate
		)}`;
	}
	return `${timestamp(start, TimestampStyle.LongDateTime)} till ${timestamp(
		end,
		TimestampStyle.LongDateTime
	)}`;
};

export default niceDate;
