'use client';

import { useState } from 'react';

interface ContactFormProps {
  data: Record<string, unknown>;
}

type Field = {
  id: string;
  type: string;
  label: string;
  placeholder?: string;
  required: boolean;
  rows?: number;
  options?: Array<{ value: string; label: string }>;
};

export default function ContactForm({ data }: ContactFormProps) {
  const {
    title,
    subtitle,
    fields,
    submit_button,
    success_message,
    error_message,
    api_endpoint,
  } = data as {
    title: string;
    subtitle: string;
    api_endpoint: string;
    fields: Field[];
    submit_button: { text: string };
    success_message: { title: string; body: string };
    error_message: { title: string; body: string };
  };

  const [name,    setName]    = useState('');
  const [email,   setEmail]   = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [status,  setStatus]  = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errors,  setErrors]  = useState<Record<string, string>>({});

  function getValue(id: string): string {
    switch (id) {
      case 'name':    return name;
      case 'email':   return email;
      case 'subject': return subject;
      case 'message': return message;
      default:        return '';
    }
  }

  function handleChange(id: string, val: string) {
    switch (id) {
      case 'name':    setName(val);    break;
      case 'email':   setEmail(val);   break;
      case 'subject': setSubject(val); break;
      case 'message': setMessage(val); break;
    }
    if (errors[id]) setErrors((prev) => { const e = { ...prev }; delete e[id]; return e; });
  }

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (!name.trim())    e.name    = 'Name is required';
    if (!email.trim())   e.email   = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Enter a valid email address';
    if (!subject)        e.subject = 'Please select a topic';
    if (!message.trim()) e.message = 'Message is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    setStatus('submitting');
    try {
      const res = await fetch(api_endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  }

  const inputBase =
    'w-full font-body text-body-md text-neutral-text-primary bg-white border rounded-xl px-4 py-3 outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-100 border-neutral-border';

  return (
    <section className="bg-neutral-50 py-16 md:py-24">
      <div className="max-w-2xl mx-auto px-6 md:px-8">
        <h2 className="font-heading font-bold text-heading-xl text-neutral-text-primary mb-3">
          {title}
        </h2>
        <p className="font-body text-body-md text-neutral-text-secondary mb-10 leading-relaxed">
          {subtitle}
        </p>

        {status === 'success' ? (
          <div className="bg-primary-50 border border-primary-100 rounded-xl p-8 text-center">
            <h3 className="font-heading font-bold text-heading-md text-primary-700">
              {success_message.title}
            </h3>
            <p className="font-body text-body-md text-neutral-text-secondary mt-3">
              {success_message.body}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate>
            {status === 'error' && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                <p className="font-body text-body-sm font-semibold text-red-700">
                  {error_message.title}
                </p>
                <p className="font-body text-body-sm text-red-600 mt-1">
                  {error_message.body}
                </p>
              </div>
            )}

            {fields.map((field) => (
              <div key={field.id} className="flex flex-col gap-1 mb-6">
                <label
                  htmlFor={field.id}
                  className="font-body text-body-sm font-semibold text-neutral-text-primary"
                >
                  {field.label}
                </label>

                {field.type === 'select' ? (
                  <select
                    id={field.id}
                    value={getValue(field.id)}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    className={inputBase}
                  >
                    <option value="">Select a topic...</option>
                    {field.options?.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                ) : field.type === 'textarea' ? (
                  <textarea
                    id={field.id}
                    rows={field.rows ?? 5}
                    placeholder={field.placeholder}
                    value={getValue(field.id)}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    className={`${inputBase} resize-none`}
                  />
                ) : (
                  <input
                    type={field.type}
                    id={field.id}
                    placeholder={field.placeholder}
                    value={getValue(field.id)}
                    onChange={(e) => handleChange(field.id, e.target.value)}
                    className={inputBase}
                  />
                )}

                {errors[field.id] && (
                  <span className="font-body text-body-sm text-red-600">
                    {errors[field.id]}
                  </span>
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={status === 'submitting'}
              className="w-full inline-flex items-center justify-center font-body font-medium rounded-xl transition-all duration-300 px-9 py-4 text-body-lg bg-primary-500 text-white hover:bg-primary-600 shadow-card hover:shadow-card-hover disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {status === 'submitting' ? 'Sending...' : submit_button.text}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
