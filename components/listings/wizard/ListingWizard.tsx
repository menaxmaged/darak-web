import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { WizardProgress } from "./WizardProgress";
import { Step1BasicInfo } from "./Step1BasicInfo";
import { Step2Payment } from "./Step2Payment";
import { Step3Details } from "./Step3Details";
import { Step4Media } from "./Step4Media";
import { ListingPreview } from "./ListingPreview";
import { useCreateListing, useUpdateListing, useUploadListingImages } from "@/Modules/listings/hooks";
import { useAreas } from "@/Modules/areas/areas";
import { useProjects } from "@/Modules/projects/hooks";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";
import { calculateInstallment } from "@/lib/constants";
import type { Listing } from "@/Modules/listings/types";

const STEPS = [
  { title: "Basic Info", description: "Property type & location" },
  { title: "Price", description: "Payment plan" },
  { title: "Details", description: "Specifications" },
  { title: "Media", description: "Photos & contact" },
];

export interface WizardData {
  // Step 1
  title: string;
  description: string;
  property_type: string;
  property_status: string;
  city: string;
  area_id: string;
  project_id: string;
  address: string;
  // Step 2
  price: string;
  is_cash_only: boolean;
  down_payment_amount: string;
  installment_years: string;
  // Step 3
  built_up_area: string;
  land_area: string;
  bedrooms: string;
  bathrooms: string;
  floor: string;
  finishing: string;
  delivery_year: string;
  view: string;
  // Step 4
  imageFiles: File[];   // raw files — sent via FormData on create, uploaded on edit
  images: string[];     // existing URL strings from backend (edit mode)
  video_url: string;
  tour_url: string;
  contact_name: string;
  contact_phone: string;
  contact_whatsapp: string;
}

const emptyData: WizardData = {
  title: "",
  description: "",
  property_type: "",
  property_status: "",
  city: "",
  area_id: "",
  project_id: "",
  address: "",
  price: "",
  is_cash_only: false,
  down_payment_amount: "",
  installment_years: "",
  built_up_area: "",
  land_area: "",
  bedrooms: "",
  bathrooms: "",
  floor: "",
  finishing: "",
  delivery_year: "",
  view: "",
  imageFiles: [],
  images: [],
  video_url: "",
  tour_url: "",
  contact_name: "",
  contact_phone: "",
  contact_whatsapp: "",
};

function listingToWizardData(listing: Listing): WizardData {
  return {
    title: listing.title ?? "",
    description: listing.description ?? "",
    property_type: listing.property_type,
    property_status: listing.property_status,
    city: listing.city,
    area_id: listing.area_id != null ? String(listing.area_id) : "",
    project_id: listing.project_id != null ? String(listing.project_id) : "",
    address: "",
    price: String(listing.price),
    is_cash_only: listing.is_cash_only,
    down_payment_amount: listing.down_payment_amount != null ? String(listing.down_payment_amount) : "",
    installment_years: listing.installment_years != null ? String(listing.installment_years) : "",
    built_up_area: String(listing.built_up_area),
    land_area: "",
    bedrooms: String(listing.bedrooms),
    bathrooms: String(listing.bathrooms),
    floor: "",
    finishing: listing.finishing ?? "",
    delivery_year: listing.delivery_year != null ? String(listing.delivery_year) : "",
    view: "",
    imageFiles: [],
    images: listing.images ?? [],
    video_url: "",
    tour_url: "",
    contact_name: "",
    contact_phone: "",
    contact_whatsapp: "",
  };
}

interface ListingWizardProps {
  onClose: () => void;
  listing?: Listing;
}

export function ListingWizard({ onClose, listing }: ListingWizardProps) {
  const isEdit = !!listing;
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<WizardData>(isEdit ? listingToWizardData(listing) : emptyData);
  const [showPreview, setShowPreview] = useState(false);
  const createListing = useCreateListing();
  const updateListing = useUpdateListing();
  const uploadImages = useUploadListingImages();

  const { data: areasRes } = useAreas({ city: data.city });
  const areas = areasRes?.data ?? [];
  const { data: projectsRes } = useProjects({ city: data.city });
  const projects = projectsRes?.data ?? [];

  // Combine existing URLs + local object URLs for preview display
  const previewImages = useMemo(() => [
    ...data.images,
    ...data.imageFiles.map((f) => URL.createObjectURL(f)),
  ], [data.images, data.imageFiles]);

  const updateData = (field: string, value: string | boolean | string[] | File[]) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!data.property_type || !data.property_status || !data.city || !data.area_id) {
          toast.error("Please fill in all required fields");
          return false;
        }
        return true;
      case 2:
        if (!data.price) {
          toast.error("Please enter the price");
          return false;
        }
        if (!data.is_cash_only && (!data.down_payment_amount || !data.installment_years)) {
          toast.error("Please complete the payment plan details or mark as cash only");
          return false;
        }
        return true;
      case 3:
        if (!data.built_up_area || !data.bedrooms || !data.bathrooms || !data.finishing) {
          toast.error("Please fill in all required property details");
          return false;
        }
        return true;
      case 4:
        if (!data.contact_name || !data.contact_phone || !data.contact_whatsapp) {
          toast.error("Please fill in your contact information");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(prev => prev + 1);
      } else {
        setShowPreview(true);
      }
    }
  };

  const handleBack = () => {
    if (showPreview) {
      setShowPreview(false);
    } else if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    } else {
      onClose();
    }
  };

  const handleSubmit = async () => {
    const price = Number(data.price);
    const downPaymentPercent = Number(data.down_payment_amount) || 0;
    const years = Number(data.installment_years) || 0;
    const areaId = data.area_id && data.area_id !== "none" ? Number(data.area_id) : null;
    const projectId = data.project_id && data.project_id !== "none" ? Number(data.project_id) : null;

    const baseBody = {
      property_type: data.property_type,
      property_status: data.property_status,
      city: data.city,
      price,
      built_up_area: Number(data.built_up_area),
      bedrooms: Number(data.bedrooms),
      bathrooms: Number(data.bathrooms),
      area_id: areaId,
      project_id: projectId,
      title: data.title || undefined,
      description: data.description || undefined,
      finishing: data.finishing || undefined,
      delivery_year: data.property_status === "offplan" && data.delivery_year
        ? Number(data.delivery_year.replace("+", ""))
        : undefined,
      is_cash_only: data.is_cash_only,
      down_payment_amount: data.is_cash_only ? undefined : downPaymentPercent || undefined,
      installment_years: data.is_cash_only ? undefined : years || undefined,
      installment_amount: data.is_cash_only ? undefined : calculateInstallment(price, downPaymentPercent, years, "monthly"),
    };

    try {
      if (isEdit) {
        // Upload any newly added files first, then include all image URLs
        let allImages = [...data.images];
        if (data.imageFiles.length > 0) {
          const uploaded = await uploadImages.mutateAsync(data.imageFiles);
          allImages = [...allImages, ...uploaded];
        }
        await updateListing.mutateAsync({
          id: String(listing.id),
          data: { ...baseBody, images: allImages.length > 0 ? allImages : undefined },
        });
        toast.success("Listing updated successfully!");
      } else {
        // Create: send all fields + files in one multipart request
        await createListing.mutateAsync({ data: baseBody, files: data.imageFiles });
        toast.success("Listing submitted for approval!");
      }
      onClose();
    } catch (error) {
      console.error("Failed to save listing:", error);
      toast.error(`Failed to ${isEdit ? "update" : "create"} listing. Please try again.`);
    }
  };

  const isPending = createListing.isPending || updateListing.isPending || uploadImages.isPending;

  return (
    <div className="container-custom py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-2xl font-bold">
            {isEdit ? "Edit Listing" : "Create New Listing"}
          </h1>
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
        </div>

        {/* Progress */}
        {!showPreview && (
          <WizardProgress currentStep={currentStep} totalSteps={4} steps={STEPS} />
        )}

        {/* Content */}
        <div className="max-w-3xl mx-auto mt-16">
          <div className="bg-card border border-border rounded-xl p-6 md:p-8">
            {showPreview ? (
              <ListingPreview
                data={data}
                previewImages={previewImages}
                areaName={areas.find(a => String(a.id) === data.area_id)?.name}
                projectName={projects.find(p => String(p.id) === data.project_id)?.name}
              />
            ) : (
              <>
                {currentStep === 1 && <Step1BasicInfo data={data} onChange={updateData} />}
                {currentStep === 2 && <Step2Payment data={data} onChange={updateData} />}
                {currentStep === 3 && <Step3Details data={data} onChange={updateData} />}
                {currentStep === 4 && <Step4Media data={data} isEdit={isEdit} onChange={updateData} />}
              </>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-8 pt-6 border-t border-border">
              <Button variant="outline" onClick={handleBack}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                {showPreview ? "Edit" : currentStep === 1 ? "Cancel" : "Back"}
              </Button>

              {showPreview ? (
                <Button
                  className="gradient-primary"
                  onClick={handleSubmit}
                  disabled={isPending}
                >
                  <Send className="h-4 w-4 mr-2" />
                  {isPending
                    ? isEdit ? "Saving..." : "Submitting..."
                    : isEdit ? "Save Changes" : "Submit for Approval"}
                </Button>
              ) : (
                <Button className="gradient-primary" onClick={handleNext}>
                  {currentStep === 4 ? "Preview" : "Next"}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              )}
            </div>
          </div>
        </div>
    </div>
  );
}

