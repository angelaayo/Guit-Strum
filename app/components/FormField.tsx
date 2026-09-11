"use client";

import { LucideIcon } from "lucide-react";
import { UseFormRegisterReturn } from "react-hook-form";

export default function FormField({
  label,
  icon: Icon,
  type,
  placeholder,
  registration,
  error,
}: {
  label: string;
  icon: LucideIcon;
  type: string;
  placeholder: string;
  registration: UseFormRegisterReturn;
  error?: string;
}) {
  return (
    <div>
      <label
        className="font-inter text-xs font-medium mb-1.5 block"
        style={{ color: "var(--color-primary)" }}
      >
        {label}
      </label>
      <div className="relative">
        <Icon
          size={16}
          className="absolute left-4 top-1/2 -translate-y-1/2"
          style={{ color: "var(--color-muted)" }}
        />
        <input
          {...registration}
          type={type}
          placeholder={placeholder}
          className="gs-input w-full border rounded-xl pl-11 pr-4 py-3.5 font-inter text-sm"
          style={{ borderColor: "var(--color-border)", backgroundColor: "var(--color-bg)" }}
        />
      </div>
      {error && (
        <p className="font-inter text-xs mt-1.5" style={{ color: "var(--color-muted-string)" }}>
          {error}
        </p>
      )}
    </div>
  );
}