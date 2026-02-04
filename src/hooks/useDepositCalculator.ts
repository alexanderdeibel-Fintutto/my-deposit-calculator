import { useMemo } from 'react';
import { addMonths, format } from 'date-fns';
import { de } from 'date-fns/locale';

export interface DepositInputs {
  kaltmiete: number;
  warmmiete?: number;
  vereinbarteMonateKaution: 1 | 2 | 3;
  mietbeginn: Date | undefined;
  kautionsart: 'sparkonto' | 'buergschaft' | 'sparbuch' | 'barzahlung';
}

export interface Rate {
  monat: number;
  betrag: number;
  faelligDatum: Date;
  faelligFormatiert: string;
}

export interface DepositResults {
  maxKaution: number;
  kautionBetrag: number;
  ersteRate: number;
  raten: Rate[];
  jaehrlicheZinsen: number;
  jaehrlicheKosten: number;
  zinssatz: number;
  kostensatz: number;
  istGueltig: boolean;
  kautionsartLabel: string;
}

const ZINSSAETZE: Record<string, { zinsen: number; kosten: number; label: string }> = {
  sparkonto: { zinsen: 0.005, kosten: 0, label: 'Mietkautionskonto (Bank)' },
  buergschaft: { zinsen: 0, kosten: 0.05, label: 'Kautionsbürgschaft' },
  sparbuch: { zinsen: 0.0001, kosten: 0, label: 'Sparbuch (verpfändet)' },
  barzahlung: { zinsen: 0, kosten: 0, label: 'Barzahlung' },
};

export function useDepositCalculator(inputs: DepositInputs): DepositResults {
  return useMemo(() => {
    const { kaltmiete, vereinbarteMonateKaution, mietbeginn, kautionsart } = inputs;
    
    const maxKaution = kaltmiete * 3;
    const kautionBetrag = kaltmiete * vereinbarteMonateKaution;
    const ersteRate = Math.ceil((kautionBetrag / 3) * 100) / 100;
    
    const kautionsConfig = ZINSSAETZE[kautionsart];
    const jaehrlicheZinsen = kautionBetrag * kautionsConfig.zinsen;
    const jaehrlicheKosten = kautionBetrag * kautionsConfig.kosten;
    
    const raten: Rate[] = [];
    if (mietbeginn) {
      for (let i = 0; i < 3; i++) {
        const faelligDatum = addMonths(mietbeginn, i);
        raten.push({
          monat: i + 1,
          betrag: i === 2 ? kautionBetrag - ersteRate * 2 : ersteRate,
          faelligDatum,
          faelligFormatiert: format(faelligDatum, 'd. MMMM yyyy', { locale: de }),
        });
      }
    }
    
    return {
      maxKaution,
      kautionBetrag,
      ersteRate,
      raten,
      jaehrlicheZinsen,
      jaehrlicheKosten,
      zinssatz: kautionsConfig.zinsen * 100,
      kostensatz: kautionsConfig.kosten * 100,
      istGueltig: kaltmiete > 0 && mietbeginn !== undefined,
      kautionsartLabel: kautionsConfig.label,
    };
  }, [inputs]);
}

export const getDefaultDepositInputs = (): DepositInputs => ({
  kaltmiete: 800,
  warmmiete: undefined,
  vereinbarteMonateKaution: 3,
  mietbeginn: undefined,
  kautionsart: 'sparkonto',
});
