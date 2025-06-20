"use client";

import React from "react";
import { Input } from "@/app/components/ui/input";
import { Textarea } from "@/app/components/ui/textarea";
import { Label } from "@/app/components/ui/label";

interface FieldConfig {
  name: string;
  label: string;
  type: "text" | "number" | "date" | "textarea" | "email";
  required?: boolean;
  placeholder?: string;
}

interface DynamicFieldProps {
  field: FieldConfig;
  value: string | undefined;
  onChange: (value: string) => void;
  error?: string;
}

export const DynamicField: React.FC<DynamicFieldProps> = ({
  field,
  value,
  onChange,
  error
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    let newValue = e.target.value;

    // Formatear el valor según el tipo
    if (field.type === "number") {
      // Remover caracteres no numéricos
      newValue = newValue.replace(/[^\d]/g, "");
    }

    onChange(newValue);
  };

  const renderField = () => {
    switch (field.type) {
      case "textarea":
        return (
          <Textarea
            id={field.name}
            value={value || ""}
            onChange={handleChange}
            placeholder={field.placeholder}
            className={error ? "border-destructive" : ""}
          />
        );
      default:
        return (
          <Input
            id={field.name}
            type={field.type}
            value={value || ""}
            onChange={handleChange}
            placeholder={field.placeholder}
            className={error ? "border-destructive" : ""}
          />
        );
    }
  };

  return (
    <div className="space-y-2">
      <Label 
        htmlFor={field.name}
        className={error ? "text-destructive" : ""}
      >
        {field.label}
        {field.required && <span className="text-destructive ml-1">*</span>}
      </Label>
      {renderField()}
      {error && <p className="text-destructive text-xs mt-1">{error}</p>}
    </div>
  );
}; 