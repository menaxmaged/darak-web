import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formatPriceEGP, calculateInstallment } from "@/lib/constants";
import type { WizardData, WizardOnChange } from "./wizard-types";

interface Step2Props {
  data: WizardData;
  onChange: WizardOnChange;
}

export function Step2Payment({ data, onChange }: Step2Props) {
  const price = Number(data.price) || 0;
  const downPaymentPercent = Number(data.down_payment_amount) || 0;
  const downPaymentAmount = Math.round((price * downPaymentPercent) / 100);
  const years = Number(data.installment_years) || 0;

  const installmentAmount = price && !data.is_cash_only && years
    ? calculateInstallment(price, downPaymentPercent, years, "monthly")
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold mb-2">Price & Payment Plan</h2>
        <p className="text-muted-foreground text-sm">Set the pricing and payment options</p>
      </div>

      {/* Total Price */}
      <div className="space-y-2">
        <Label htmlFor="price">Total Price (EGP) *</Label>
        <Input
          id="price"
          type="number"
          placeholder="e.g., 2500000"
          value={data.price}
          onChange={(e) => onChange("price", e.target.value)}
        />
        {price > 0 && (
          <p className="text-sm text-muted-foreground">{formatPriceEGP(price)}</p>
        )}
      </div>

      {/* Cash Only Toggle */}
      <div className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
        <div>
          <Label>Cash Only</Label>
          <p className="text-sm text-muted-foreground">Is this a cash-only sale?</p>
        </div>
        <Switch
          checked={data.is_cash_only}
          onCheckedChange={(checked: boolean) => onChange("is_cash_only", checked)}
        />
      </div>

      {/* Payment Plan Details */}
      {!data.is_cash_only && (
        <div className="space-y-4 p-4 border border-border rounded-lg">
          <h3 className="font-semibold">Payment Plan Details</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="down_payment">Down Payment</Label>
              <Input
                id="down_payment"
                type="number"
                min={price / 10}
                max={price}
                placeholder="e.g., 10"
                value={data.down_payment_amount}
                onChange={(e) => onChange("down_payment_amount", e.target.value)}
              />
              {downPaymentAmount > 0 && (
                <p className="text-sm text-primary font-medium">
                  = {formatPriceEGP(downPaymentAmount)}
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="years">Installment Years</Label>
              <Select 
                value={data.installment_years} 
                onValueChange={(v) => onChange("installment_years", v)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select years" />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((y) => (
                    <SelectItem key={y} value={y.toString()}>{y} year{y > 1 ? 's' : ''}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {installmentAmount > 0 && (
            <div className="p-4 bg-primary/10 rounded-lg">
              <p className="text-sm text-muted-foreground">Calculated Installment</p>
              <p className="text-2xl font-bold text-primary">{formatPriceEGP(installmentAmount)}</p>
              <p className="text-sm text-muted-foreground">per month</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
