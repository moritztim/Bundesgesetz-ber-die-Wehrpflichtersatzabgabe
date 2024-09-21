/**
 * @file Bundesgesetz über die Wehrpflichtersatzabgabe
 * @see https://www.fedlex.admin.ch/eli/cc/1959/2035_2097_2125
 */

/**
 * {@link SchweizerBürger Schweizer Bürger}, die ihre Wehrpflicht nicht oder nur teilweise durch persönliche Dienstleistung (Militär- oder Zivildienst) erfüllen, haben {@link Ersatzflicht einen Ersatz in Geld zu leisten}.
 * @see https://www.fedlex.admin.ch/eli/cc/1959/2035_2097_2125#art_1
 * */
class Ersatzpflichtiger extends SchweizerBürger {
	constructor(
		geburt: Date,
		reineinkommen: Reineinkommen,
		existenzminimum: number,
		hatBehinderungsbedingteLebensunterhaltskosten?: boolean,
		tod?: Date,
		erstazpflichtBeginnJahr?: number,
		ersatzpflichtEndJahr?: number
	) {
		super(geburt, reineinkommen, existenzminimum, hatBehinderungsbedingteLebensunterhaltskosten, tod)
		this.ersatzpflicht = new Ersatzflicht(
			this,
			erstazpflichtBeginnJahr ? new Date(erstazpflichtBeginnJahr, 0, 1) : undefined,
			ersatzpflichtEndJahr ? new Date(ersatzpflichtEndJahr, 11, 31) : undefined
		)
	}
	ersatzpflicht: Ersatzflicht
	ersatzabgabe(jahr: number): Ersatzabgabe | undefined {
		if (
			// Von der Ersatzpflicht ist befreit, wer im Ersatzjahr:
			(
				// a. wegen erheblicher körperlicher, geistiger oder psychischer Behinderung ein taxpflichtiges Einkommen erzielt, das nach nochmaligem Abzug von Versicherungsleistungen gemäss Artikel 12 Absatz 1 Buchstabe c sowie von behinderungsbedingten Lebenshaltungskosten sein betreibungsrechtliches Existenzminimum um nicht mehr als 100 Prozent übersteigt;
				(this.hatBehinderungsbedingteLebensunterhaltskosten && this.reineinkommen.verringertDurchBehinderung && !(this.reineinkommen.netto < (this.existenzminimum + this.existenzminimum / 100 * 100))) ||
				// e. das Schweizer Bürgerrecht erworben oder verloren hat.
				this.bürgerechtsHistorie.some((bürgerrecht) => jahr in [bürgerrecht.erwerb, bürgerrecht.verlust].map((date) => date?.getFullYear()))
			) ||
			// Stirbt der Ersatzpflichtige, so entfällt die Abgabe für das Todesjahr.
			this.tod?.getFullYear() == jahr
		) return undefined
	}
}

/**
 * Die {@link Ersatzpflicht} {@link beginn}t frühestens am Anfang des Jahres, in dem der Wehrpflichtige das {@link Ersatzflicht.ALTERSJAHR_ZU_FRÜHESTEM_BEGINN 19}. {@link SchweizerBürger.altersjahr Altersjahr} vollendet. Sie dauert längstens bis zum Ende des Jahres, in dem er das {@link Ersatzflicht.ALTERSJAHR_ZU_SPÄTESTEM_ENDE 37}. {@link SchweizerBürger.altersjahr Altersjahr} vollendet.
 * @see https://www.fedlex.admin.ch/eli/cc/1959/2035_2097_2125#art_3
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

/**
 * Die Ersatzabgabe wird nach der Gesetzgebung über die direkte Bundessteuer auf dem gesamten Reineinkommen erhoben, das der {@link Ersatzpflichtiger Ersatzpflichtige} im In- und Ausland erzielt.
 * @see https://www.fedlex.admin.ch/eli/cc/1959/2035_2097_2125#art_11
 */
class Reineinkommen {
	constructor(
		private readonly brutto: number,
		/** Vom {@link Reineinkommen} werden abgezogen:
		 *
		 *	@property die {@link abzüge.sozialabzüge Sozialabzüge} nach den für das Ersatzjahr geltenden Bestimmungen für die direkte Bundessteuer;
		 *	@property die {@link abzüge.steuerbareVersicherungsLeistungen steuerbaren Leistungen}, die der {@link Ersatzpflichtiger Ersatzpflichtige} von der Militärversicherung, der Invalidenversicherung, der Schweizerischen Unfallversicherungsanstalt oder von einer andern öffentlichrechtlichen oder privatrechtlichen Unfall -, Kranken - oder Invalidenversicherung erhält; 
		 *
		 *  Massgebend sind die Verhältnisse des Ersatzpflichtigen in der Veranlagungsperiode der Steuer, nach deren Grundlagen die Ersatzabgabe veranlagt wird. Wird die Ersatzabgabe aufgrund einer besonderen Ersatzabgabeerklärung veranlagt, so sind die Verhältnisse des Ersatzpflichtigen am Ende des Ersatzjahres massgebend.
		 * 
		 * @link https://www.fedlex.admin.ch/eli/cc/1959/2035_2097_2125#art_12
		 */
		private readonly abzüge: {
			/** die {@link abzüge.sozialabzüge Sozialabzüge} nach den für das Ersatzjahr geltenden Bestimmungen für die direkte Bundessteuer */
			sozialabzüge: number,
			/** die {@link abzüge.steuerbareVersicherungsLeistungen steuerbaren Leistungen}, die der {@link Ersatzpflichtiger Ersatzpflichtige} von der Militärversicherung, der Invalidenversicherung, der Schweizerischen Unfallversicherungsanstalt oder von einer andern öffentlichrechtlichen oder privatrechtlichen Unfall -, Kranken - oder Invalidenversicherung erhält */
			steuerbareVersicherungsLeistungen: number
		},
		/** Einkommen ist wegen erheblicher körperlicher, geistiger oder psychischer Behinderung verringert */
		public verringertDurchBehinderung = false
	) {
		let wert = this.brutto
		for (const key in this.abzüge) {
			if (Object.prototype.hasOwnProperty.call(this.abzüge, key)) {
				const abzug = this.abzüge[key];
				wert -= abzug
			}
		}
		this.netto = wert
	}

	public readonly netto: number
}

class Ersatzabgabe {
	static readonly MINDEST_BETRAG = 400
	constructor(
		public gegenstand: Reineinkommen,
		private readonly herabgesetzt = false
	) {
		let result = 0;

		// Die Ersatzabgabe beträgt 3 Franken je 100 Franken des taxpflichtigen Einkommens,
		for (let franken = 0; franken <= this.gegenstand.netto; franken += 100) {
			result += 3
		}

		// mindestens aber 400 Franken.
		result = Math.max(Ersatzabgabe.MINDEST_BETRAG, result)

		// Für ersatzpflichtige Behinderte, die nach Artikel 4 Absatz 1 Buchstabe a nicht von der Ersatzpflicht befreit sind,
		this.betrag = result - (
			this.herabgesetzt ?
				// wird die Ersatzabgabe um die Hälfte herabgesetzt.
				result * 0.5 : 0
		)
	}

	/**
	 * Die {@link Ersatzabgabe} beträgt 3 Franken je 100 Franken des {@link Ersatzabgabe.gegenstand taxpflichtigen Einkommens}, mindestens aber {@link Ersatzabgabe.MINDEST_BETRAG 400} Franken.
	 * 
	 * Für {@link Ersatzpflichtiger ersatzpflichtige} Behinderte, die nach Artikel 4 Absatz 1 Buchstabe a nicht von der {@link Ersatzpflicht} befreit sind, wird die {@link Ersatzabgabe} um die Hälfte herabgesetzt.
	 * 
	 * @link https://www.fedlex.admin.ch/eli/cc/1959/2035_2097_2125#art_13
	 */
	readonly betrag: number
}
