class SchweizerBürger {
	constructor(
		public geburt: Date,
		public reineinkommen: Reineinkommen,
		public tod?: Date
	) { }

	altersjahr(alter: number) {
		return this.geburt.getFullYear() + alter - 1;
	}
}