import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PROPERTY_TYPES } from "@/lib/constants";
import { useAreas } from "@/Modules/areas/areas";
import { useCitiesAdmin } from "@/Modules/cities/hooks";
import { useProjects } from "@/Modules/projects/hooks";
import type { WizardData, WizardOnChange } from "./wizard-types";

interface Step1Props {
  data: WizardData;
  onChange: WizardOnChange;
}

export function Step1BasicInfo({ data, onChange }: Step1Props) {
  const { data: citiesRes } = useCitiesAdmin({ limit: 100 });
  const cities = citiesRes?.data ?? [];

  const { data: areasRes } = useAreas({ city: data.city });
  const areas = areasRes?.data ?? [];

  const { data: projectsRes } = useProjects({ city: data.city });
  const projects = projectsRes?.data ?? [];

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
          <Select
            value={data.city}
            onValueChange={(v) => {
              onChange("city", v);
              onChange("area_id", "");
              onChange("project_id", "");
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select city" />
            </SelectTrigger>
            <SelectContent>
              {cities.map((city) => (
                <SelectItem key={city.id} value={city.name}>{city.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label>Area *</Label>
          <Select
            value={data.area_id}
            onValueChange={(v) => onChange("area_id", v)}
            disabled={!data.city}
          >
            <SelectTrigger>
              <SelectValue placeholder={data.city ? "Select area" : "Select city first"} />
            </SelectTrigger>
            <SelectContent>
              {areas.map((area) => (
                <SelectItem key={area.id} value={String(area.id)}>{area.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Project & Address */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Compound / Project</Label>
          <Select
            value={data.project_id}
            onValueChange={(v) => onChange("project_id", v)}
            disabled={!data.city}
          >
            <SelectTrigger>
              <SelectValue placeholder={data.city ? "Select project (optional)" : "Select city first"} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {projects.map((project) => (
                <SelectItem key={project.id} value={String(project.id)}>{project.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {/* <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            placeholder="Full address (optional)"
            value={data.address}
            onChange={(e) => onChange("address", e.target.value)}
          />
        </div> */}
      </div>
    </div>
  );
}
