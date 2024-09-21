class SchweizerBürger {
	constructor(
		public geburt: Date,
		public reineinkommen: Reineinkommen,
		public existenzminimum: number,
		public hatBehinderungsbedingteLebensunterhaltskosten = false,
		public bürgerrechtsHistorie: { erwerb: Date, verlust?: Date }[],
		public tod?: Date
	) { }

	altersjahr(alter: number) {
		return this.geburt.getFullYear() + alter - 1;
	}
}