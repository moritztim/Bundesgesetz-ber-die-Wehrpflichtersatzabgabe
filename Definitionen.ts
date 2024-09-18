class SchweizerBürger {
	constructor(
		public geburt: Date
	) { }

	altersjahr(alter: number) {
		return this.geburt.getFullYear() + alter - 1;
	}
}