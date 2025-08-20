import React from 'react';
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export default function FormField({
  id,
  name,
  type = "text",
  label,
  placeholder,
  value,
  onChange,
  disabled = false,
  maxLength,
  autoFocus = false,
  required = false,
  className = ""
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>
      <Input
        id={id}
        name={name}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        maxLength={maxLength}
        autoFocus={autoFocus}
        className={className}
      />
    </div>
  );
}