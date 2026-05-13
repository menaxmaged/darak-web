import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PROPERTY_TYPES, CITIES } from "@/lib/constants";
import { useAreas } from "@/Modules/areas/areas";

interface Step1Props {
  data: {
    title: string;
    description: string;
    property_type: string;
    property_status: string;
    city: string;
    area: string;
    project_name: string;
    address: string;
  };
  onChange: (field: string, value: string) => void;
}

export function Step1BasicInfo({ data, onChange }: Step1Props) {
  const { data: areas } = useAreas({ city: data.city });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold mb-2">Basic Information</h2>
        <p className="text-muted-foreground text-sm">Enter the basic details of your property</p>
      </div>

      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="title">Listing Title *</Label>
        <Input
          id="title"
          placeholder="e.g., Luxury 3-Bedroom Apartment in Madinaty"
          value={data.title}
          onChange={(e) => onChange("title", e.target.value)}
        />
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          placeholder="Describe your property..."
          rows={4}
          value={data.description}
          onChange={(e) => onChange("description", e.target.value)}
        />
      </div>

      {/* Property Type & Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Property Type *</Label>
          <Select value={data.property_type} onValueChange={(v) => onChange("property_type", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {PROPERTY_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Property Status *</Label>
          <Select value={data.property_status} onValueChange={(v) => onChange("property_status", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ready">Ready to Move</SelectItem>
              <SelectItem value="offplan">Off-Plan / Under Construction</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Location */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>City *</Label>
          <Select value={data.city} onValueChange={(v) => { onChange("city", v); onChange("area", ""); }}>
            <SelectTrigger>
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              {CITIES.map((city) => (
                <SelectItem key={city} value={city}>{city}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Area *</Label>
          <Select value={data.area} onValueChange={(v) => onChange("area", v)}>
            <SelectTrigger>
              <SelectValue placeholder="Select area" />
            </SelectTrigger>
            <SelectContent>
              {areas?.data.map((area) => (
                <SelectItem key={area.id} value={area.name}>{area.name}</SelectItem>
              )) || <SelectItem value="other">Other</SelectItem>}
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Project Name & Address */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="project_name">Compound / Project Name</Label>
          <Input
            id="project_name"
            placeholder="e.g., Madinaty, Palm Hills"
            value={data.project_name}
            onChange={(e) => onChange("project_name", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            placeholder="Full address (optional)"
            value={data.address}
            onChange={(e) => onChange("address", e.target.value)}
          />
        </div>
      </div>
    </div>
  );
}
