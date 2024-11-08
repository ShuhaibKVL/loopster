// Form.tsx
import React from 'react';
import '../globals.css'

interface Field {
  name: string;
  label: string;
  type: string;
  placeHolder?:string;
  value?:string;
}

interface FormProps {
  fields: Field[];
  onSubmit: (data: any) => void;
  fieldErrors?: { [key: string]: string }; // Make fieldErrors optional
}

const Form: React.FC<FormProps> = ({ fields, onSubmit, fieldErrors }) => {
  const [formData, setFormData] = React.useState<any>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {fields.map((field) => (
        <div key={field.name} className="mb-4">
          <div className="flex justify-between items-center">
            <label htmlFor={field.name} className="block font-medium text-gray-700">
              {field.label}
            </label>
            {fieldErrors && fieldErrors[field.name] && (
            <p className="text-red-600 text-sm md:text-md">{fieldErrors[field.name]}</p>
            )}
          </div>
          <input
            type={field.type}
            name={field.name}
            id={field.name}
            placeholder={field?.placeHolder}
            value={field?.value}
            onChange={handleChange}
            className="mt-1 block w-full border rounded-md shadow-sm focus:ring-secondary"
          />
        </div>
      ))}
      <button type="submit" className="bg-primary text-white py-2 px-4 rounded w-full">
        Submit
      </button>
    </form>
  );
};

export default Form;
