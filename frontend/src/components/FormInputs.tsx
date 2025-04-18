import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react';

 interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
   label: string;
 }

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
    label: string;
    type?: 'text' | 'email' | 'password' | 'number';
  }
  
  interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    options: string[];
  }
  
  interface FormTextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
  }

  export default function FormInputLogin({ label, ...props }: FormInputProps) {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">{label}</label>
        <input
          {...props}
          className="w-full p-3 bg-dark-card border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-blue text-white"
        />
      </div>
    );
  }

  export function FormInput({ label, type = 'text', ...props }: FormInputProps) {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">{label}</label>
        <input
          type={type}
          {...props}
          className="w-full p-3 bg-dark-card border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-blue text-white"
        />
      </div>
    );
  }
  
  export function FormSelect({ label, options, ...props }: FormSelectProps) {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">{label}</label>
        <select
          {...props}
          className="w-full p-3 bg-dark-card border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-blue text-white"
        >
          <option value="">Selecione</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>
    );
  }
  
  export function FormTextarea({ label, ...props }: FormTextareaProps) {
    return (
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">{label}</label>
        <textarea
          {...props}
          className="w-full p-3 bg-dark-card border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-neon-blue text-white"
        />
      </div>
    );
  }