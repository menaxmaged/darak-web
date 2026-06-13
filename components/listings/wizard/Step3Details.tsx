import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FINISHING_TYPES, FLOOR_TYPES, VIEW_TYPES, DELIVERY_YEARS } from "@/lib/constants";
import { COMMERCIAL_TYPES, type WizardData, type WizardOnChange } from "./wizard-types";

export function Step3Details({ data, onChange }: { data: WizardData; onChange: WizardOnChange }) {
  const isOffplan = data.property_status === "offplan";
  const isCommercial = COMMERCIAL_TYPES.includes(data.property_type as typeof COMMERCIAL_TYPES[number]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold mb-2">Property Details</h2>
        <p className="text-muted-foreground text-sm">Specify the property specifications</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="built_up_area">Built-up Area (m²) *</Label>
          <Input
            id="built_up_area"
            type="number"
            placeholder="e.g., 150"
            value={data.built_up_area}
            onChange={(e) => onChange("built_up_area", e.target.value)}
          />
        </div>
        {!isCommercial && (
          <>
            <div className="space-y-2">
              <Label htmlFor="land_area">Land Area (m²)</Label>
              <Input
                id="land_area"
                type="number"
                placeholder="For villas, townhouses (optional)"
                value={data.land_area}
                onChange={(e) => onChange("land_area", e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms *</Label>
              <Select value={data.bedrooms} onValueChange={(v) => onChange("bedrooms", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Studio</SelectItem>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="6">6+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms *</Label>
              <Select value={data.bathrooms} onValueChange={(v) => onChange("bathrooms", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="6">6+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Floor</Label>
              <Select value={data.floor} onValueChange={(v) => onChange("floor", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select floor" />
                </SelectTrigger>
                <SelectContent>
                  {FLOOR_TYPES.map((f) => (
                    <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>View</Label>
              <Select value={data.view} onValueChange={(v) => onChange("view", v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select view" />
                </SelectTrigger>
                <SelectContent>
                  {VIEW_TYPES.map((v) => (
                    <SelectItem key={v.value} value={v.value}>{v.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </>
        )}

        <div className="space-y-2">
          <Label>Finishing *</Label>
          <Select value={data.finishing} onValueChange={(v) => onChange("finishing", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select finishing" />
            </SelectTrigger>
            <SelectContent>
              {FINISHING_TYPES.map((f) => (
                <SelectItem key={f.value} value={f.value}>{f.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Delivery</Label>
          {isOffplan ? (
            <Select value={data.delivery_year} onValueChange={(v) => onChange("delivery_year", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select delivery year" />
              </SelectTrigger>
              <SelectContent>
                {DELIVERY_YEARS.map((y) => (
                  <SelectItem key={y} value={y}>{y}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <div className="p-3 bg-emerald-100 text-emerald-800 rounded-lg text-sm font-medium">
              ✓ Ready to Move / Delivered
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
