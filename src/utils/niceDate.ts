const niceDate = (start: Date, end: Date, all_day?: boolean) => {
	const st = start.getTime() / 1000;
	const et = end.getTime() / 1000;

	if (start.getDay() === end.getDay()) {
		if (all_day) {
			return `<t:${st}:D>`;
		}
		return `<t:${st}:F> till <t:${et}:t>`;
	}
	if (all_day) {
		return `<t:${st}:D> till <t:${et}:D>`;
	}
	return `<t:${st}:F> till <t:${et}:F>`;
};

export default niceDate;
