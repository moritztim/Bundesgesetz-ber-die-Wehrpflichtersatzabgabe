/**
 * @file Bundesgesetz über die Wehrpflichtersatzabgabe
 * @see https://www.fedlex.admin.ch/eli/cc/1959/2035_2097_2125/de
 */

/**
 * {@link SchweizerBürger Schweizer Bürger}, die ihre Wehrpflicht nicht oder nur teilweise durch persönliche Dienstleistung (Militär- oder Zivildienst) erfüllen, haben {@link Ersatzflicht einen Ersatz in Geld zu leisten}.
 * @see https://www.fedlex.admin.ch/eli/cc/1959/2035_2097_2125/de#art_1
 * */
class Ersatzpflichtiger extends SchweizerBürger {
	constructor(
		geburt: Date,
		erstazpflichtBeginnJahr?: number,
		ersatzpflichtEndJahr?: number
	) {
		super(geburt)
		this.ersatzpflicht = new Ersatzflicht(
			this,
			erstazpflichtBeginnJahr ? new Date(erstazpflichtBeginnJahr, 0, 1) : undefined,
			ersatzpflichtEndJahr ? new Date(ersatzpflichtEndJahr, 11, 31) : undefined
		)
	}
	ersatzpflicht: Ersatzflicht
}

/**
 * Die {@link Ersatzpflicht} {@link beginn}t frühestens am Anfang des Jahres, in dem der Wehrpflichtige das {@link Ersatzflicht.ALTERSJAHR_ZU_FRÜHESTEM_BEGINN 19}. {@link SchweizerBürger.altersjahr Altersjahr} vollendet. Sie dauert längstens bis zum Ende des Jahres, in dem er das {@link Ersatzflicht.ALTERSJAHR_ZU_SPÄTESTEM_ENDE 37}. {@link SchweizerBürger.altersjahr Altersjahr} vollendet.
 * @see https://www.fedlex.admin.ch/eli/cc/1959/2035_2097_2125/de#art_3
 * */
class Ersatzflicht {
	static readonly DAUER_IN_JAHREN = 11
	static readonly DAUER = new Date(this.DAUER_IN_JAHREN, 0, 1)

	static readonly ALTERSJAHR_ZU_FRÜHESTEM_BEGINN = 19
	static readonly ALTERSJAHR_ZU_SPÄTESTEM_ENDE = 37

	/**
	 * Frühestens der Anfang des Jahres, in dem {@link Ersatzpflichtiger der Pflichtige} das {@link Ersatzflicht.ALTERSJAHR_ZU_FRÜHESTEM_BEGINN 19}. {@link SchweizerBürger.altersjahr Altersjahr} vollendet
	 * */
	beginn: Date
	/**
	 * Spätestens das Ende des Jahres, in dem {@link Ersatzpflichtiger der Pflichtige} das {@link Ersatzflicht.ALTERSJAHR_ZU_SPÄTESTEM_ENDE 37}. {@link SchweizerBürger.altersjahr Altersjahr} vollendet
	 * */
	ende: Date
	constructor(
		Ersatzpflichtiger: SchweizerBürger,
		beginn?: Date,
		ende?: Date
	) {
		const frühesterErsatzpflichtBeginn = Ersatzflicht.frühesterBeginn(Ersatzpflichtiger)
		const spätestesErsatzpflichtEnde = Ersatzflicht.spätestesEnde(Ersatzpflichtiger)

		if (beginn !== undefined && beginn < frühesterErsatzpflichtBeginn) {
			throw new Error(`Die Ersatzpflicht beginnt frühestens am Anfang des Jahres, in dem der Wehrpflichtige das ${Ersatzflicht.ALTERSJAHR_ZU_FRÜHESTEM_BEGINN}. Altersjahr vollendet.`)
		}
		if (ende !== undefined && ende > spätestesErsatzpflichtEnde) {
			throw new Error(`Die Ersatzpflicht dauert längstens bis zum Ende des Jahres, in dem der Wehrpflichtige das ${Ersatzflicht.ALTERSJAHR_ZU_SPÄTESTEM_ENDE}. Altersjahr vollendet.`)
		}

		if (ende !== undefined) {
			beginn ??= subtractDates(ende, Ersatzflicht.DAUER)
		}
		else if (beginn !== undefined) {
			ende ??= addDates(beginn, Ersatzflicht.DAUER)
		}

		if (ende !== undefined && beginn !== undefined && subtractDates(ende, beginn) !== Ersatzflicht.DAUER) {
			throw new Error(`Die Ersatzpflicht dauert ${Ersatzflicht.DAUER_IN_JAHREN} Jahre.`)
		}

		this.beginn = beginn ?? frühesterErsatzpflichtBeginn
		this.ende = ende ?? addDates(this.beginn, Ersatzflicht.DAUER)
	}

	/**
	 * Der Anfang des Jahres, in dem {@link Ersatzpflichtiger der Pflichtige} das {@link Ersatzflicht.ALTERSJAHR_ZU_FRÜHESTEM_BEGINN 19}. {@link SchweizerBürger.altersjahr Altersjahr} vollendet
	 * */
	static frühesterBeginn(für: SchweizerBürger): Date {
		return new Date(für.altersjahr(this.ALTERSJAHR_ZU_FRÜHESTEM_BEGINN) + 1, 0, 1);
	}

	/**
	 * Das Ende des Jahres, in dem {@link Ersatzpflichtiger der Pflichtige} {@link Ersatzflicht.ALTERSJAHR_ZU_SPÄTESTEM_ENDE 37}. {@link SchweizerBürger.altersjahr Altersjahr} vollendet
	 * */
	static spätestesEnde(für: SchweizerBürger): Date {
		return new Date(für.altersjahr(this.ALTERSJAHR_ZU_SPÄTESTEM_ENDE) + 1, 11, 31);
	}

}

