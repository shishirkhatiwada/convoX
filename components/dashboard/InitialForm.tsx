"use client";
import { cn } from "@/lib/utils";
import {
  Building2,
  Globe,
  LinkIcon,
  Sparkles,
  ScanIcon,
  ChevronLeft,
  Icon,
  Command,
  ArrowRight,
} from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";

interface InitialData {
  businessName: string;
  websiteUrl: string;
  externalLink: string;
}

const STEPS = [
  {
    id: "name",
    label: "Business Name",
    description: "This will be the description of your business",
    fields: "businessName" as keyof InitialData,
    question: "What is the name of your business?",
    icon: Building2,
    placeholder: "e.g., Acme Corp",
    type: "text",
  },
  {
    id: "website",
    label: " website",
    description: "What is the website of your business?",
    fields: "websiteUrl" as keyof InitialData,
    question: "What is the website of your business?",
    icon: Globe,
    placeholder: "e.g., www.acme.com",
    type: "text",
  },
  {
    id: "links",
    label: "Extra Links",
    description: "What is the name of your business?",
    fields: "externalLink" as keyof InitialData,
    question: "What is the name of your business?",
    icon: LinkIcon,
    badge: "Optional",
    placeholder: "e.g., Provide any relevant links",
    type: "textarea",
  },
];

const InitialForm = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<InitialData>({
    businessName: "",
    websiteUrl: "",
    externalLink: "",
  });

  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const stepData = STEPS[currentStep];

  const Icon = stepData.icon;

  useEffect(() => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 300);
  }, [currentStep]);

  const handleNext = async () => {
    if (isSubmitting) return;

    const currentField = STEPS[currentStep].fields;
    const value = formData[currentField];

    if (currentStep < 2 && (!value || value.trim() === "")) return;

    if (currentStep < STEPS.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
        setIsAnimating(false);
      }, 300);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep((prev) => prev - 1);
        setIsAnimating(false);
      }, 300);
    }
  };

  // Fix: Create separate handler for textarea with correct type
  const handleTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      handleNext();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleNext();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    const response = await fetch("/api/metadata/store", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            business_name: formData.businessName,
            website_url: formData.websiteUrl,
            external_link: formData.externalLink,
        }),

    
    });
    await response.json();
        setIsSubmitting(false);
        window.location.reload();
  };

  const isStepValid =
    currentStep >= 2 ||
    (formData[stepData.fields] && formData[stepData.fields].trim() !== "");

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col justify-center min-h-100">
      <div className="fixed top-0 left-0 w-full h-1 bg-white/5">
        <div
          className="h-full bg-gray-700 transition-all duration-500 ease-in"
          style={{ width: `${progress}%` }}
        />
      </div>
      <div className="fixed top-0 right-6 md:top-8 md:right-8 text-xs font-medium text-zinc-600 uppercase tracking-widest pointer-events-none fade-in ">
        Setup your account
      </div>

      {isSubmitting ? (
        <div className="flex flex-col items-center justify-center text-center animate-in fade-in duration-700">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-indigo-500/30 blur-xl rounded-full animate-pulse" />
            <div className="relative w-16 h-16 bg-gradient-to-tr from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <ScanIcon className="w-8 h-8 text-white animate-bounce" />
            </div>
          </div>
          <h2 className="text-2xl font-medium text-white mb-2">
            Storing your organization info!
          </h2>
          <p className="text-zinc-500 ">Scanning {formData.websiteUrl}...</p>
        </div>
      ) : (
        <div
          className={cn(
            "transistion-all duration-300ease-in-out transform",
            isAnimating
              ? "opacity-0 translate-y-4 scale-95"
              : "opacity-100 translate-y-0 scale-100",
          )}
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              {currentStep > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBack}
                  className="text-zinc-500 hover:text-zinc-300"
                >
                  <ChevronLeft className="h-5 w-5" />
                </Button>
              )}

              <span className="text-xs font-medium text-indigo-400 uppercase ">
                Step {currentStep + 1} of {STEPS.length}
              </span>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <h1 className="text-3xl md:text-4xl font-medium text-white leading-tight">
                {stepData.question}
              </h1>
              <p className="text-lg text-zinc-500 font-light">
                {stepData.description}
              </p>
            </div>

            <div className="relative group">
              {stepData.type === "textarea" ? (
                <Textarea
                  ref={inputRef as any}
                  // Fix: Use correct field property name
                  value={formData[stepData.fields] as string}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [stepData.fields]: e.target.value,
                    })
                  }
                  onKeyDown={handleTextareaKeyDown}
                  placeholder={stepData.placeholder}
                  className="w-full bg-transparent border-0 border-b "
                  autoFocus
                />
              ) : (
                <Input
                  ref={inputRef as any}
                  type={stepData.type}
                  // Fix: Use correct field property name and event handler
                  value={formData[stepData.fields] as string}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      [stepData.fields]: e.target.value,
                    })
                  }
                  onKeyDown={handleKeyDown}
                  placeholder={stepData.placeholder}
                  className="w-full bg-transparent border-0 border-b border-white/10 text-xl md:text-2xl py-4 pr-12 text-white placeholder:text-zinc-700 focus-visible:ring-0 focus-visible:border-indigo-500 rounded-none shadow-none transition-colors "
                  autoFocus
                />
              )}

              {/* Fix: Icon positioning - move inside the div with proper positioning */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 text-zinc-600 pointer-events-none">
                <Icon className="w-6 h-6" />
              </div>
            </div>
          </div>

<div className="flex items-center justify-between pt-8">
    <div className="hidden sm:flex items-center gap-2 text-xs ">
        {stepData.type === "textarea" ? (
            <>
            <Command className="h-4 w-4" />
            <span>+ Enter </span>
            </>
        ) : (
            <span>Press Enter + ↵ </span>
        )}
        <span className="ml-1">to continue</span>
    </div>

<Button
onClick={handleNext}
disabled={!isStepValid}
className={cn(
    "rounded-full px-8 py-6 text-base font-medium transistion-all duration-300",
    isStepValid
        ? "bg-indigo-500 text-white hover:bg-indigo-600"
        : "bg-indigo-500/50 text-white cursor-not-allowed",
)}
>
{currentStep === STEPS.length - 1 ? "Submit" : "Continue"}
{currentStep === STEPS.length - 1 ? (
    <Sparkles className="w-4 h-4 ml-2" />
) : (
    <ArrowRight className="w-4 h-4 ml-2" />
)}
</Button>


</div>

        </div>
      )}
    </div>
  );
};

export default InitialForm;
