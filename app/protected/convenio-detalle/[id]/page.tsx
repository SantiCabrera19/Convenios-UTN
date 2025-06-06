"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useParams } from 'next/navigation';
import { 
  ChevronLeftIcon, 
  BuildingIcon, 
  UserIcon, 
  CalendarIcon,
  FileTextIcon,
  CheckIcon,
  AlertCircleIcon,
  EyeIcon,
  SaveIcon
} from "lucide-react";
import Link from "next/link";
import React from "react";

import { 
  BackgroundPattern, 
  SectionContainer 
} from "@/app/components/dashboard";
import { ConvenioMarcoForm } from '@/app/components/forms/convenio-marco/ConvenioMarcoForm';
import { Button } from "@/components/ui/button";
import { Progress } from "@/app/components/ui/progress";
import { useConvenioMarcoStore } from "@/stores/convenioMarcoStore";
import { cn } from "@/lib/utils";

// Componente de esqueleto para el formulario
const FormSkeleton = () => (
  <div className="space-y-6 animate-pulse p-6">
    <div className="h-8 w-1/2 bg-muted rounded"></div>
    <div className="space-y-4">
      <div className="h-12 bg-muted rounded"></div>
      <div className="h-12 bg-muted rounded"></div>
      <div className="h-12 bg-muted rounded"></div>
    </div>
    <div className="flex justify-between">
      <div className="h-10 w-28 bg-muted rounded"></div>
      <div className="h-10 w-28 bg-muted rounded"></div>
    </div>
  </div>
);

// Tipos de pasos del formulario
type Step = {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
  status: "upcoming" | "current" | "complete";
};

export default function ConvenioPage() {
  const params = useParams<{ id: string }>();
  const paramId = params.id;
  const isCreating = paramId === "nuevo";
  const searchParams = useSearchParams();
  const type = searchParams.get('type');
  
  // Estado para el progreso del formulario
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [formState, setFormState] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  // Store de Zustand para manejo de estado global
  const { convenioData, updateConvenioData } = useConvenioMarcoStore();

  // Simulamos la carga inicial
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  // Definición de los pasos
  const steps: Step[] = [
    {
      id: 1,
      title: "Datos de la Entidad",
      description: "Información básica de la entidad",
      icon: <BuildingIcon className="h-5 w-5" />,
      status: currentStep === 1 ? "current" : currentStep > 1 ? "complete" : "upcoming"
    },
    {
      id: 2,
      title: "Datos del Representante",
      description: "Información del representante legal",
      icon: <UserIcon className="h-5 w-5" />,
      status: currentStep === 2 ? "current" : currentStep > 2 ? "complete" : "upcoming"
    },
    {
      id: 3,
      title: "Fechas del Convenio",
      description: "Vigencia y plazos",
      icon: <CalendarIcon className="h-5 w-5" />,
      status: currentStep === 3 ? "current" : currentStep > 3 ? "complete" : "upcoming"
    }
  ];

  // Actualizar progreso cuando cambia el paso
  useEffect(() => {
    setProgress((currentStep / steps.length) * 100);
    
    // Actualizar el store global según el paso completado
    if (currentStep > 1 && formState[1]) {
      updateConvenioData('entidad', formState[1]);
    }
    if (currentStep > 2 && formState[2]) {
      updateConvenioData('representante', formState[2]);
    }
    if (currentStep === 3 && formState[3]) {
      updateConvenioData('fechas', formState[3]);
    }
  }, [currentStep, steps.length, formState, updateConvenioData]);

  if (isCreating && type === 'marco') {
    return (
      <>
        <BackgroundPattern />
        <div className="p-8 w-full relative">
          <Suspense fallback={<div className="h-24 w-full skeleton"></div>}>
            <div className="mb-8 border-b border-border/40 pb-6">
              <div className="flex items-center justify-between mb-2">
                <Link
                  href="/protected"
                  className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  <ChevronLeftIcon className="h-4 w-4 mr-1" /> 
                  Volver al dashboard
                </Link>
                
                <div className="flex items-center gap-3">
                  <Button variant="ghost" size="sm" className="gap-2 text-sm">
                    <EyeIcon className="h-4 w-4" />
                    Vista previa
                  </Button>
                  <Button variant="outline" size="sm" className="gap-2 text-sm">
                    <SaveIcon className="h-4 w-4" />
                    Guardar borrador
                  </Button>
                </div>
              </div>

              <div className="mt-6">
                <h1 className="text-2xl font-bold">Nuevo Convenio Marco</h1>
                <p className="text-muted-foreground mt-1">Completá la información del convenio marco paso a paso</p>
              </div>
            </div>
          </Suspense>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-2">
            {/* Contenido Principal */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card rounded-lg border shadow-sm animate-in fade-in-50 duration-300">
                {/* Stepper con animaciones */}
                <div className="p-6 border-b border-border/60">
                  <div className="flex items-center gap-4">
                    {steps.map((step, idx) => (
                      <React.Fragment key={step.id}>
                        <div className={cn(
                          "flex items-center gap-2 transition-all duration-300",
                          step.status === "current" ? "text-primary font-medium" :
                          step.status === "complete" ? "text-green-500" :
                          "text-muted-foreground"
                        )}>
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300",
                            step.status === "current" ? "border-primary bg-primary/10" :
                            step.status === "complete" ? "border-green-500 bg-green-500/10" :
                            "border-muted-foreground/30 bg-background"
                          )}>
                            {step.status === "complete" ? (
                              <CheckIcon className="h-4 w-4" />
                            ) : (
                              <span>{step.id}</span>
                            )}
                          </div>
                          <span className="hidden md:inline text-sm">{step.title}</span>
                        </div>
                        {idx < steps.length - 1 && (
                          <div className={cn(
                            "h-0.5 flex-grow max-w-16 transition-all duration-500",
                            step.status === "complete" ? "bg-green-500" : "bg-muted"
                          )}></div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                  <Progress value={progress} className="h-1 mt-4" />
                </div>

                {/* Error y carga */}
                {error && (
                  <div className="mx-6 mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg flex items-center gap-2 text-destructive animate-in slide-in-from-top-4 duration-300">
                    <AlertCircleIcon className="h-5 w-5 flex-shrink-0" />
                    <p>{error}</p>
                  </div>
                )}

                {loading ? (
                  <FormSkeleton />
                ) : (
                  <div className="p-6 animate-in fade-in-50 duration-300 slide-in-from-bottom-2">
                    <ConvenioMarcoForm 
                      currentStep={currentStep}
                      onStepChange={setCurrentStep}
                      formState={formState}
                      onFormStateChange={setFormState}
                      onError={setError}
                      isSubmitting={isSubmitting}
                      setIsSubmitting={setIsSubmitting}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <SectionContainer title="Progreso">
                <div className="space-y-4">
                  {steps.map((step) => (
                    <div 
                      key={step.id}
                      className={cn(
                        "p-4 rounded-lg border transition-all duration-300",
                        step.status === "current" ? "bg-primary/5 border-primary/20 scale-105 shadow-sm" :
                        step.status === "complete" ? "bg-green-500/5 border-green-500/20" :
                        "bg-card border-border"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "p-2 rounded-lg",
                          step.status === "current" ? "bg-primary/10" :
                          step.status === "complete" ? "bg-green-500/10" :
                          "bg-muted"
                        )}>
                          {step.status === "complete" ? (
                            <CheckIcon className="h-5 w-5 text-green-500" />
                          ) : (
                            step.icon
                          )}
                        </div>
                        <div>
                          <h3 className={cn(
                            "font-medium",
                            step.status === "current" ? "text-primary" :
                            step.status === "complete" ? "text-green-500" :
                            "text-muted-foreground"
                          )}>
                            {step.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {step.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </SectionContainer>
              
              <SectionContainer title="Acciones rápidas">
                <div className="space-y-3">
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-sm">
                    <EyeIcon className="h-4 w-4" />
                    Vista previa completa
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start gap-2 text-sm">
                    <SaveIcon className="h-4 w-4" />
                    Guardar y continuar después
                  </Button>
                </div>
              </SectionContainer>
            </div>
          </div>
        </div>
      </>
    );
  }

  // Si no es convenio marco, mostrar mensaje de no disponible
  return (
    <>
      <BackgroundPattern />
      <div className="p-8 w-full relative">
        <div className="flex items-center justify-center h-[60vh]">
          <SectionContainer title="No disponible">
            <div className="text-center py-8">
              <FileTextIcon className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
              <h2 className="text-xl font-semibold mb-2">Tipo de Convenio No Disponible</h2>
              <p className="text-muted-foreground mb-6">
                Por el momento, solo está disponible la creación de Convenios Marco.
              </p>
              <Link href="/protected">
                <Button>
                  <ChevronLeftIcon className="h-4 w-4 mr-2" />
                  Volver al Inicio
                </Button>
              </Link>
            </div>
          </SectionContainer>
        </div>
      </div>
    </>
  );
} 