'use client'

import React, { useState, ChangeEvent, FormEvent } from 'react';
import '../globals.css'


// Define a type for form fields
interface FormField {
  name: string;
  type: string;
  label: string;
  placeholder?: string;
  required?: boolean;
}

interface FormProps {
  fields: FormField[];
  onSubmit: (formData: { [key: string]: any }) => void;
}

const Form: React.FC<FormProps> = ({ fields, onSubmit }) => {
  const [formData, setFormData] = useState<{ [key: string]: any }>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map((field) => (
        <div key={field.name}>
          <label htmlFor={field.name} className="block font-medium text-gray-700">
            {field.label}
          </label>
          <input
            id={field.name}
            name={field.name}
            type={field.type}
            placeholder={field.placeholder}
            required={field.required}
            className="mt-1 block w-full p-2 text-black border border-gray-300 rounded-lg"
            onChange={handleChange}
          />
        </div>
      ))}
      <button type="submit" className='w-full py-2 text-white px-4 rounded-md bg-primary hover:bg-secondary transition'>
        Submit
      </button>
    </form>
  );
};

export default Form;
