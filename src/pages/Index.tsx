import { useState } from 'react';
import { Shield, Calculator, Scale } from 'lucide-react';
import { DepositInputsSection } from '@/components/deposit/DepositInputs';
import { DepositResultsDisplay } from '@/components/deposit/DepositResults';
import { useDepositCalculator, getDefaultDepositInputs } from '@/hooks/useDepositCalculator';
import type { DepositInputs } from '@/hooks/useDepositCalculator';

const Index = () => {
  const [inputs, setInputs] = useState<DepositInputs>(getDefaultDepositInputs());
  const results = useDepositCalculator(inputs);

  return (
    <div className="min-h-screen gradient-hero">
      {/* Header */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-foreground">Kautions-Rechner</h1>
                <p className="text-xs text-muted-foreground">Nach deutschem Mietrecht</p>
              </div>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <Scale className="w-4 h-4" />
              <span>§551 BGB</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-8 md:py-12 border-b border-border/50">
        <div className="container">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <Calculator className="w-4 h-4" />
              Kostenlos & sofort
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Mietkaution berechnen
            </h2>
            <p className="text-lg text-muted-foreground">
              Berechnen Sie die Kaution nach deutschem Mietrecht. Inkl. Ratenzahlung, 
              Zinsen und Kosten für verschiedene Kautionsarten.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <main className="container py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Left Column - Inputs */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6">
              Eingaben
            </h3>
            <DepositInputsSection inputs={inputs} onChange={setInputs} />
          </div>

          {/* Right Column - Results */}
          <div className="lg:sticky lg:top-24 lg:self-start">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-6">
              Ergebnis
            </h3>
            <DepositResultsDisplay results={results} />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border py-8 mt-12">
        <div className="container">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg gradient-primary flex items-center justify-center">
                <Shield className="w-4 h-4 text-primary-foreground" />
              </div>
              <span className="text-sm text-muted-foreground">
                Kautions-Rechner nach §551 BGB
              </span>
            </div>
            <p className="text-xs text-muted-foreground text-center md:text-right">
              Diese Berechnung dient nur zur Information und ersetzt keine rechtliche Beratung.
            </p>
          </div>
        </div>
      </footer>

      {/* Mobile Sticky Summary */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-card border-t border-border p-4 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-xs text-muted-foreground">Gesamtkaution</div>
            <div className="text-2xl font-bold text-primary">
              {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(results.kautionBetrag)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs text-muted-foreground">Pro Rate</div>
            <div className="text-lg font-semibold text-foreground">
              {new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(results.ersteRate)}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile spacer */}
      <div className="lg:hidden h-24" />
    </div>
  );
};

export default Index;
