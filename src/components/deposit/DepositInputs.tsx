import { Euro, Calendar, Shield, Info } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import type { DepositInputs } from '@/hooks/useDepositCalculator';

interface DepositInputsProps {
  inputs: DepositInputs;
  onChange: (inputs: DepositInputs) => void;
}

export function DepositInputsSection({ inputs, onChange }: DepositInputsProps) {
  const updateField = <K extends keyof DepositInputs>(
    field: K,
    value: DepositInputs[K]
  ) => {
    onChange({ ...inputs, [field]: value });
  };

  return (
    <div className="space-y-8">
      {/* Miete Section */}
      <div className="card-elevated p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
            <Euro className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Mietangaben</h3>
            <p className="text-sm text-muted-foreground">Basis für die Kautionsberechnung</p>
          </div>
        </div>

        <div className="grid gap-5">
          <div>
            <Label htmlFor="kaltmiete" className="text-sm font-medium text-foreground mb-2 block">
              Nettokaltmiete (€/Monat) *
            </Label>
            <div className="relative">
              <Input
                id="kaltmiete"
                type="number"
                min={0}
                step={1}
                value={inputs.kaltmiete || ''}
                onChange={(e) => updateField('kaltmiete', parseFloat(e.target.value) || 0)}
                className="pl-10 h-12 text-lg font-medium"
                placeholder="z.B. 800"
              />
              <Euro className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              Kaltmiete ohne Nebenkosten
            </p>
          </div>

          <div>
            <Label htmlFor="warmmiete" className="text-sm font-medium text-foreground mb-2 block">
              Warmmiete (€/Monat)
              <span className="text-muted-foreground font-normal ml-1">optional</span>
            </Label>
            <div className="relative">
              <Input
                id="warmmiete"
                type="number"
                min={0}
                step={1}
                value={inputs.warmmiete || ''}
                onChange={(e) => updateField('warmmiete', parseFloat(e.target.value) || undefined)}
                className="pl-10 h-12"
                placeholder="z.B. 1100"
              />
              <Euro className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-1.5">
              Nur zur Info – nicht relevant für Kaution
            </p>
          </div>
        </div>
      </div>

      {/* Kautions-Details Section */}
      <div className="card-elevated p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-lg gradient-primary flex items-center justify-center">
            <Shield className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Kautions-Details</h3>
            <p className="text-sm text-muted-foreground">Nach §551 BGB</p>
          </div>
        </div>

        <div className="grid gap-5">
          <div>
            <Label className="text-sm font-medium text-foreground mb-2 block">
              Vereinbarte Kaution *
            </Label>
            <Select
              value={String(inputs.vereinbarteMonateKaution)}
              onValueChange={(v) => updateField('vereinbarteMonateKaution', parseInt(v) as 1 | 2 | 3)}
            >
              <SelectTrigger className="h-12 text-base bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="1">1 Monatsmiete</SelectItem>
                <SelectItem value="2">2 Monatsmieten</SelectItem>
                <SelectItem value="3">3 Monatsmieten (Maximum)</SelectItem>
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1.5">
              Maximal 3 Nettokaltmieten erlaubt
            </p>
          </div>

          <div>
            <Label className="text-sm font-medium text-foreground mb-2 block">
              Mietbeginn *
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full h-12 justify-start text-left font-normal text-base bg-background",
                    !inputs.mietbeginn && "text-muted-foreground"
                  )}
                >
                  <Calendar className="mr-3 h-5 w-5" />
                  {inputs.mietbeginn
                    ? format(inputs.mietbeginn, 'd. MMMM yyyy', { locale: de })
                    : 'Datum auswählen'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-popover" align="start">
                <CalendarComponent
                  mode="single"
                  selected={inputs.mietbeginn}
                  onSelect={(date) => updateField('mietbeginn', date)}
                  initialFocus
                  className="pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            <p className="text-xs text-muted-foreground mt-1.5">
              Bestimmt Fälligkeitstermine der Raten
            </p>
          </div>

          <div>
            <Label className="text-sm font-medium text-foreground mb-2 block">
              Kautionsart
            </Label>
            <Select
              value={inputs.kautionsart}
              onValueChange={(v) => updateField('kautionsart', v as DepositInputs['kautionsart'])}
            >
              <SelectTrigger className="h-12 text-base bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-popover">
                <SelectItem value="sparkonto">
                  <div className="flex items-center gap-2">
                    <span>Mietkautionskonto (Bank)</span>
                    <span className="text-xs text-primary">0,5% Zinsen</span>
                  </div>
                </SelectItem>
                <SelectItem value="buergschaft">
                  <div className="flex items-center gap-2">
                    <span>Kautionsbürgschaft</span>
                    <span className="text-xs text-warning">5% Kosten/Jahr</span>
                  </div>
                </SelectItem>
                <SelectItem value="sparbuch">
                  <div className="flex items-center gap-2">
                    <span>Sparbuch (verpfändet)</span>
                    <span className="text-xs text-muted-foreground">0,01% Zinsen</span>
                  </div>
                </SelectItem>
                <SelectItem value="barzahlung">Barzahlung</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Info Box */}
      <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/10">
        <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="text-sm text-muted-foreground">
          <p className="font-medium text-foreground mb-1">§551 BGB – Mietkaution</p>
          <p>
            Die Kaution darf maximal 3 Nettokaltmieten betragen. Der Mieter kann in 3 gleichen 
            Monatsraten zahlen. Die erste Rate ist zu Mietbeginn fällig.
          </p>
        </div>
      </div>
    </div>
  );
}
