import { Wallet, CalendarDays, TrendingUp, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { DepositResults } from '@/hooks/useDepositCalculator';

interface DepositResultsProps {
  results: DepositResults;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('de-DE', {
    style: 'currency',
    currency: 'EUR',
  }).format(value);
}

export function DepositResultsDisplay({ results }: DepositResultsProps) {
  const {
    maxKaution,
    kautionBetrag,
    raten,
    jaehrlicheZinsen,
    jaehrlicheKosten,
    zinssatz,
    kostensatz,
    istGueltig,
    kautionsartLabel,
  } = results;

  return (
    <div className="space-y-6">
      {/* Hauptergebnis */}
      <div className="card-elevated p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 gradient-primary opacity-10 rounded-full -translate-y-1/2 translate-x-1/2" />
        
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
            <Wallet className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Kautionsbetrag</h3>
            <p className="text-sm text-muted-foreground">{kautionsartLabel}</p>
          </div>
        </div>

        <div className="text-center py-4">
          <div className="text-5xl font-bold text-primary mb-2 animate-scale-in">
            {formatCurrency(kautionBetrag)}
          </div>
          <p className="text-muted-foreground">
            Gesetzliches Maximum: {formatCurrency(maxKaution)}
          </p>
        </div>

        {kautionBetrag <= maxKaution ? (
          <div className="flex items-center justify-center gap-2 mt-4 p-3 rounded-lg bg-success/10">
            <CheckCircle2 className="w-5 h-5 text-success" />
            <span className="text-sm font-medium text-success">
              Rechtlich zulässige Kaution
            </span>
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 mt-4 p-3 rounded-lg bg-destructive/10">
            <AlertCircle className="w-5 h-5 text-destructive" />
            <span className="text-sm font-medium text-destructive">
              Überschreitet gesetzliches Maximum!
            </span>
          </div>
        )}
      </div>

      {/* Ratenzahlung */}
      <div className="card-elevated p-6">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
            <CalendarDays className="w-5 h-5 text-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Ratenzahlung</h3>
            <p className="text-sm text-muted-foreground">3 Raten nach §551 BGB</p>
          </div>
        </div>

        {!istGueltig ? (
          <div className="text-center py-6 text-muted-foreground">
            <p>Bitte wählen Sie ein Mietbeginn-Datum</p>
          </div>
        ) : (
          <div className="space-y-3">
            {raten.map((rate, index) => (
              <div
                key={rate.monat}
                className={cn(
                  "flex items-center justify-between p-4 rounded-lg border transition-all duration-200 animate-fade-in",
                  index === 0 
                    ? "border-primary/30 bg-primary/5" 
                    : "border-border bg-muted/30"
                )}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="flex items-center gap-3">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold",
                    index === 0 
                      ? "bg-primary text-primary-foreground" 
                      : "bg-muted text-muted-foreground"
                  )}>
                    {rate.monat}
                  </div>
                  <div>
                    <div className="font-medium text-foreground">
                      {index === 0 ? 'Erste Rate (bei Mietbeginn)' : `${rate.monat}. Rate`}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Fällig: {rate.faelligFormatiert}
                    </div>
                  </div>
                </div>
                <div className={cn(
                  "text-lg font-semibold",
                  index === 0 ? "text-primary" : "text-foreground"
                )}>
                  {formatCurrency(rate.betrag)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Zinsen/Kosten */}
      {(jaehrlicheZinsen > 0 || jaehrlicheKosten > 0) && (
        <div className="card-elevated p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center",
              jaehrlicheKosten > 0 ? "bg-warning/10" : "bg-success/10"
            )}>
              <TrendingUp className={cn(
                "w-5 h-5",
                jaehrlicheKosten > 0 ? "text-warning" : "text-success"
              )} />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">
                {jaehrlicheKosten > 0 ? 'Jährliche Kosten' : 'Jährliche Zinsen'}
              </h3>
              <p className="text-sm text-muted-foreground">
                {jaehrlicheKosten > 0 ? `${kostensatz}% Bürgschaftsgebühr` : `${zinssatz}% Zinssatz`}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
            <span className="text-muted-foreground">
              {jaehrlicheKosten > 0 ? 'Kosten pro Jahr' : 'Zinsertrag pro Jahr'}
            </span>
            <span className={cn(
              "text-2xl font-bold",
              jaehrlicheKosten > 0 ? "text-warning" : "text-success"
            )}>
              {jaehrlicheKosten > 0 
                ? `-${formatCurrency(jaehrlicheKosten)}`
                : `+${formatCurrency(jaehrlicheZinsen)}`
              }
            </span>
          </div>

          {jaehrlicheKosten > 0 && (
            <p className="text-xs text-muted-foreground mt-3">
              Bei einer Kautionsbürgschaft zahlt der Mieter jährliche Gebühren 
              an den Bürgschaftsgeber.
            </p>
          )}
        </div>
      )}

      {/* Hinweis */}
      <div className="p-4 rounded-lg bg-muted/50 border border-border">
        <p className="text-xs text-muted-foreground text-center">
          Diese Berechnung dient nur zur Information und ersetzt keine rechtliche Beratung.
        </p>
      </div>
    </div>
  );
}
