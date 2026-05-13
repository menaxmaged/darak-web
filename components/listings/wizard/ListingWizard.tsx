import { useState } from "react";
import { Button } from "@/components/ui/button";
import { WizardProgress } from "./WizardProgress";
import { Step1BasicInfo } from "./Step1BasicInfo";
import { Step2Payment } from "./Step2Payment";
import { Step3Details } from "./Step3Details";
import { Step4Media } from "./Step4Media";
import { ListingPreview } from "./ListingPreview";
import { useCreateListing } from "@/Modules/listings/hooks";
import { useAuth } from "@/lib/providers/auth-provider";
import { toast } from "sonner";
import { ArrowLeft, ArrowRight, Send } from "lucide-react";
import { calculateInstallment } from "@/lib/constants";

const STEPS = [
  { title: "Basic Info", description: "Property type & location" },
  { title: "Price", description: "Payment plan" },
  { title: "Details", description: "Specifications" },
  { title: "Media", description: "Photos & contact" },
];

interface WizardData {
  // Step 1
  title: string;
  description: string;
  property_type: string;
  property_status: string;
  city: string;
  area: string;
  project_name: string;
  address: string;
  // Step 2
  price: string;
  is_cash_only: boolean;
  down_payment_percentage: string;
  installment_years: string;
  installment_frequency: string;
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
  images: string[];
  video_url: string;
  tour_url: string;
  contact_name: string;
  contact_phone: string;
  contact_whatsapp: string;
}

const initialData: WizardData = {
  title: "",
  description: "",
  property_type: "",
  property_status: "",
  city: "",
  area: "",
  project_name: "",
  address: "",
  price: "",
  is_cash_only: false,
  down_payment_percentage: "",
  installment_years: "",
  installment_frequency: "",
  built_up_area: "",
  land_area: "",
  bedrooms: "",
  bathrooms: "",
  floor: "",
  finishing: "",
  delivery_year: "",
  view: "",
  images: [],
  video_url: "",
  tour_url: "",
  contact_name: "",
  contact_phone: "",
  contact_whatsapp: "",
};

interface ListingWizardProps {
  onClose: () => void;
}

export function ListingWizard({ onClose }: ListingWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [data, setData] = useState<WizardData>(initialData);
  const [showPreview, setShowPreview] = useState(false);
  const { user } = useAuth();
  const createListing = useCreateListing();
  

  const updateData = (field: string, value: string | boolean | string[]) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!data.title || !data.property_type || !data.property_status || !data.city || !data.area) {
          toast.error("Please fill in all required fields");
          return false;
        }
        return true;
      case 2:
        if (!data.price) {
          toast.error("Please enter the price");
          return false;
        }
        if (!data.is_cash_only && (!data.down_payment_percentage || !data.installment_years || !data.installment_frequency)) {
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
    if (!user) {
      toast.error("You must be logged in to create a listing");
      return;
    }

    const price = Number(data.price);
    const downPaymentPercent = Number(data.down_payment_percentage) || 0;
    const years = Number(data.installment_years) || 0;
    const frequency = data.installment_frequency;

    const listingData = {
      advertiser_id: String(user.id),
      title: data.title,
        description: data.description || undefined,
      is_featured: false,
      property_type: data.property_type as any,
      property_status: data.property_status as any,
      city: data.city,
      area: data.area,
        project_name: data.project_name || undefined,
        address: data.address || undefined,
      price: price,
      is_cash_only: data.is_cash_only,
      down_payment_percentage: data.is_cash_only ? undefined : downPaymentPercent,
      down_payment_amount: data.is_cash_only ? undefined : Math.round((price * downPaymentPercent) / 100),
        installment_years: data.is_cash_only ? undefined : years,
        installment_frequency: data.is_cash_only ? undefined : (frequency as any),
        installment_amount: data.is_cash_only ? undefined : calculateInstallment(price, downPaymentPercent, years, frequency),
      built_up_area: Number(data.built_up_area),
      land_area: data.land_area ? Number(data.land_area) : undefined,
      bedrooms: Number(data.bedrooms),
      bathrooms: Number(data.bathrooms),
      floor: data.floor ? (data.floor as any) : undefined,
      finishing: data.finishing as any,
      delivery_year: data.property_status === "offplan" && data.delivery_year ? Number(data.delivery_year.replace("+", "")) : undefined,
      view: data.view ? (data.view as any) : undefined,
      images: data.images,
        video_url: data.video_url || undefined,
        tour_url: data.tour_url || undefined,
      contact_name: data.contact_name,
      contact_phone: data.contact_phone,
      contact_whatsapp: data.contact_whatsapp,
    };

    try {
      await createListing.mutateAsync(listingData);
      toast.success("Listing submitted for approval!");
      onClose();
    } catch (error) {
      console.error("Failed to create listing:", error);
      toast.error("Failed to create listing. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 bg-background/95 backdrop-blur-sm z-50 overflow-y-auto">
      <div className="container-custom py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-2xl font-bold">Create New Listing</h1>
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
              <ListingPreview data={data} />
            ) : (
              <>
                {currentStep === 1 && <Step1BasicInfo data={data} onChange={updateData} />}
                {currentStep === 2 && <Step2Payment data={data} onChange={updateData} />}
                {currentStep === 3 && <Step3Details data={data} onChange={updateData} />}
                {currentStep === 4 && <Step4Media data={data} onChange={updateData} />}
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
                  disabled={createListing.isPending}
                >
                  <Send className="h-4 w-4 mr-2" />
                  {createListing.isPending ? "Submitting..." : "Submit for Approval"}
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
    </div>
  );
}
