import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";
import { useUploadListingImages } from "@/Modules/listings/hooks";
import { toast } from "sonner";
import type { WizardData, WizardOnChange } from "./wizard-types";

export function Step4Media({ data, isEdit = false, onChange }: { data: WizardData; isEdit?: boolean; onChange: WizardOnChange }) {
  const uploadImages = useUploadListingImages();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const selected = Array.from(files);

    if (isEdit) {
      try {
        const urls = await uploadImages.mutateAsync(selected);
        onChange("images", [...data.images, ...urls]);
        toast.success(`${selected.length} image(s) uploaded`);
      } catch {
        toast.error("Failed to upload images");
      }
    } else {
      onChange("imageFiles", [...data.imageFiles, ...selected]);
    }
    e.target.value = "";
  };

  const removeNewFile = (index: number) => {
    onChange("imageFiles", data.imageFiles.filter((_, i) => i !== index));
  };

  const removeExistingUrl = (index: number) => {
    onChange("images", data.images.filter((_, i) => i !== index));
  };

  const isUploading = uploadImages.isPending;
  const totalCount = data.images.length + data.imageFiles.length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-xl font-bold mb-2">Media & Contact</h2>
        <p className="text-muted-foreground text-sm">Upload photos and add your contact information</p>
      </div>

      {/* Image Upload */}
      <div className="space-y-3">
        <Label>Property Photos</Label>
        <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
            id="image-upload"
            disabled={isUploading}
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-10 w-10 text-muted-foreground" />
              <p className="font-medium">
                {isUploading ? "Uploading..." : "Click to upload photos"}
              </p>
              <p className="text-sm text-muted-foreground">PNG, JPG up to 10MB each</p>
            </div>
          </label>
        </div>

        {/* Existing URL images (edit mode) */}
        {data.images.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {data.images.map((url, index) => (
              <div key={url} className="relative group aspect-video rounded-lg overflow-hidden bg-secondary">
                <img src={url} alt={`Image ${index + 1}`} className="w-full h-full object-cover" />
                <button
                  onClick={() => removeExistingUrl(index)}
                  className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
                {index === 0 && data.imageFiles.length === 0 && (
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded">
                    Cover
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {/* New file previews */}
        {data.imageFiles.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {data.imageFiles.map((file, index) => (
              <div key={index} className="relative group aspect-video rounded-lg overflow-hidden bg-secondary">
                <img
                  src={URL.createObjectURL(file)}
                  alt={file.name}
                  className="w-full h-full object-cover"
                />
                <button
                  onClick={() => removeNewFile(index)}
                  className="absolute top-2 right-2 p-1 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
                {index === 0 && data.images.length === 0 && (
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 bg-primary text-primary-foreground text-xs rounded">
                    Cover
                  </span>
                )}
              </div>
            ))}
          </div>
        )}

        {totalCount === 0 && (
          <p className="text-sm text-muted-foreground text-center">No photos added yet</p>
        )}
      </div>

      {/* Video & Tour URLs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="video_url">Video URL (optional)</Label>
          <Input
            id="video_url"
            placeholder="YouTube or Vimeo link"
            value={data.video_url}
            onChange={(e) => onChange("video_url", e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tour_url">3D Tour URL (optional)</Label>
          <Input
            id="tour_url"
            placeholder="Matterport or similar link"
            value={data.tour_url}
            onChange={(e) => onChange("tour_url", e.target.value)}
          />
        </div>
      </div>

      {/* Contact Info */}
      <div className="p-4 border border-border rounded-lg space-y-4">
        <h3 className="font-semibold">Contact Information</h3>
        <p className="text-sm text-muted-foreground">
          This information will be displayed to potential buyers
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="contact_name">Name *</Label>
            <Input
              id="contact_name"
              placeholder="Your name"
              value={data.contact_name}
              onChange={(e) => onChange("contact_name", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact_phone">Phone *</Label>
            <Input
              id="contact_phone"
              placeholder="+201XXXXXXXXX"
              value={data.contact_phone}
              onChange={(e) => onChange("contact_phone", e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact_whatsapp">WhatsApp *</Label>
            <Input
              id="contact_whatsapp"
              placeholder="+201XXXXXXXXX"
              value={data.contact_whatsapp}
              onChange={(e) => onChange("contact_whatsapp", e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
