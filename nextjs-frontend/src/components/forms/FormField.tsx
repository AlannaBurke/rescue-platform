'use client';

import React from 'react';

interface FormFieldProps {
  label: string;
  name: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}

export function FormField({ label, name, required, hint, error, children }: FormFieldProps) {
  return (
    <div className="mb-6">
      <label htmlFor={name} className="block text-sm font-semibold text-gray-800 mb-1">
        {label}
        {required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
      </label>
      {hint && <p className="text-sm text-gray-500 mb-2">{hint}</p>}
      {children}
      {error && <p className="mt-1 text-sm text-red-600" role="alert">{error}</p>}
    </div>
  );
}

interface TextInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  error?: boolean;
}

export function TextInput({ name, error, className = '', ...props }: TextInputProps) {
  return (
    <input
      id={name}
      name={name}
      className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors ${
        error ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
      } ${className}`}
      {...props}
    />
  );
}

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  name: string;
  error?: boolean;
}

export function TextArea({ name, error, className = '', rows = 4, ...props }: TextAreaProps) {
  return (
    <textarea
      id={name}
      name={name}
      rows={rows}
      className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors resize-y ${
        error ? 'border-red-400 bg-red-50' : 'border-gray-300 bg-white'
      } ${className}`}
      {...props}
    />
  );
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  options: { value: string; label: string }[];
  placeholder?: string;
  error?: boolean;
}

export function Select({ name, options, placeholder, error, className = '', ...props }: SelectProps) {
  return (
    <select
      id={name}
      name={name}
      className={`w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors bg-white ${
        error ? 'border-red-400' : 'border-gray-300'
      } ${className}`}
      {...props}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  );
}

interface RadioGroupProps {
  name: string;
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (value: string) => void;
  required?: boolean;
}

export function RadioGroup({ name, options, value, onChange, required }: RadioGroupProps) {
  return (
    <div className="space-y-2 mt-1">
      {options.map((opt) => (
        <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
          <input
            type="radio"
            name={name}
            value={opt.value}
            required={required}
            checked={value === opt.value}
            onChange={() => onChange?.(opt.value)}
            className="w-4 h-4 text-emerald-600 border-gray-300 focus:ring-emerald-500"
          />
          <span className="text-sm text-gray-700 group-hover:text-gray-900">{opt.label}</span>
        </label>
      ))}
    </div>
  );
}

interface CheckboxGroupProps {
  name: string;
  options: { value: string; label: string }[];
  values?: string[];
  onChange?: (values: string[]) => void;
}

export function CheckboxGroup({ name, options, values = [], onChange }: CheckboxGroupProps) {
  const toggle = (val: string) => {
    const next = values.includes(val)
      ? values.filter((v) => v !== val)
      : [...values, val];
    onChange?.(next);
  };

  return (
    <div className="space-y-2 mt-1">
      {options.map((opt) => (
        <label key={opt.value} className="flex items-center gap-3 cursor-pointer group">
          <input
            type="checkbox"
            name={name}
            value={opt.value}
            checked={values.includes(opt.value)}
            onChange={() => toggle(opt.value)}
            className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
          />
          <span className="text-sm text-gray-700 group-hover:text-gray-900">{opt.label}</span>
        </label>
      ))}
    </div>
  );
}

export function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div className="mb-8 pb-4 border-b-2 border-emerald-100">
      <h2 className="text-xl font-bold text-gray-900">{title}</h2>
      {description && <p className="mt-2 text-sm text-gray-600 leading-relaxed">{description}</p>}
    </div>
  );
}

export function InfoBox({ children, variant = 'info' }: { children: React.ReactNode; variant?: 'info' | 'warning' | 'success' }) {
  const styles = {
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    success: 'bg-emerald-50 border-emerald-200 text-emerald-800',
  };
  return (
    <div className={`rounded-lg border p-4 mb-6 text-sm leading-relaxed ${styles[variant]}`}>
      {children}
    </div>
  );
}
