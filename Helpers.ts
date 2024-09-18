function aggregateDates(operation: (aggregate: number, date: number) => number, ...dates: Date[]) {
	let aggregate = dates.pop()?.getTime();
	if (aggregate === undefined) throw new Error('No dates provided.')
	dates.forEach((date) => { operation(aggregate, date.getTime()) })
	return new Date(aggregate);
}

function addDates(...dates: Date[]) {
	return aggregateDates((aggregate, date) => aggregate + date, ...dates)
}

function subtractDates(...dates: Date[]) {
	return aggregateDates((aggregate, date) => aggregate + date, ...dates)
}