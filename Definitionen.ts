class SchweizerBürger {
	constructor(
		public geburt: Date,
		public reineinkommen: Reineinkommen,
		public existenzminimum: number,
		public hatBehinderungsbedingteLebensunterhaltskosten = false,
		public bürgerechtsHistorie: { erwerb: Date, verlust?: Date }[],
		/** Bezieht eine Rente oder eine Hilflosenentschädigung der Eidgenössischen Invalidenversicherung oder der Unfallversicherung */
		public beziehtIvOderUvGelder = false,
		public tod?: Date
	) { }

	altersjahr(alter: number) {
		return this.geburt.getFullYear() + alter - 1;
	}
}

enum RelevanterGrund {
	erheblicheBehinderung,
	gesundheitDurchMilitärdienstGeschädigt,
	gesundheitDurchZivildienstGeschädigt
}

type MilitärdienstDispenz = {
	relevanterGrund?: RelevanterGrund
}

class Militärdiensttauglichkeitsentscheid {
	constructor(
		tauglich: true
	)
	constructor(
		tauglich: false,
		grund?: RelevanterGrund
	)
	constructor(
		public tauglich: boolean,
		public relevanterGrund?: RelevanterGrund
	) {
	}
}