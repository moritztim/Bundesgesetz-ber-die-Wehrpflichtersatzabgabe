class SchweizerBürger {
	constructor(
		public geburt: Date,
		public tod: Date,
		public reineinkommen: Reineinkommen
	) { }

	altersjahr(alter: number) {
		return this.geburt.getFullYear() + alter - 1;
	}
}