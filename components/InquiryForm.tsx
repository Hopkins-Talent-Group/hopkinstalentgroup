'use client';

import { useState } from 'react';
import { site } from '@/data/site';
import { submitInquiry } from '@/lib/contact/submit';

const { form } = site.contact;

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

export default function InquiryForm() {
  const [state, setState] = useState<SubmitState>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state === 'submitting') return;

    const formElement = event.currentTarget;
    const data = new FormData(formElement);
    const payload = {
      name: String(data.get('name') ?? ''),
      email: String(data.get('email') ?? ''),
      inquiry: String(data.get('inquiry') ?? ''),
      artist: String(data.get('artist') ?? ''),
      message: String(data.get('message') ?? ''),
      website: String(data.get('website') ?? ''),
    };

    setState('submitting');
    setErrorMessage('');
    setFieldErrors({});

    const result = await submitInquiry(payload);

    if (result.ok) {
      formElement.reset();
      setState('success');
      return;
    }

    setErrorMessage(result.message);
    setFieldErrors(result.fieldErrors);
    setState('error');
  }

  function renderFieldError(name: string) {
    const message = fieldErrors[name];
    if (!message) return null;
    return (
      <span className="field-error" id={`${name}-error`} role="alert">
        {message}
      </span>
    );
  }

  function fieldA11y(name: string) {
    return {
      'aria-invalid': fieldErrors[name] ? true : undefined,
      'aria-describedby': fieldErrors[name] ? `${name}-error` : undefined,
    };
  }

  return (
    <div className="form-card">
      <h3>{form.title}</h3>
      <p>{form.intro}</p>
      <form onSubmit={handleSubmit}>
        <div className="form-grid">
          <div className="field">
            <label htmlFor="name">Full name *</label>
            <input
              id="name"
              name="name"
              required
              maxLength={100}
              autoComplete="name"
              placeholder="Your name"
              {...fieldA11y('name')}
            />
            {renderFieldError('name')}
          </div>
          <div className="field">
            <label htmlFor="email">Email address *</label>
            <input
              id="email"
              name="email"
              type="email"
              required
              maxLength={254}
              autoComplete="email"
              placeholder="you@example.com"
              {...fieldA11y('email')}
            />
            {renderFieldError('email')}
          </div>
          <div className="field">
            <label htmlFor="inquiry">Inquiry type *</label>
            <select
              id="inquiry"
              name="inquiry"
              required
              defaultValue={form.inquiryTypes[0]}
              {...fieldA11y('inquiry')}
            >
              {form.inquiryTypes.map((type) => (
                <option value={type} key={type}>
                  {type}
                </option>
              ))}
            </select>
            {renderFieldError('inquiry')}
          </div>
          <div className="field">
            <label htmlFor="artist">Artist / company</label>
            <input
              id="artist"
              name="artist"
              maxLength={150}
              placeholder="If applicable"
              {...fieldA11y('artist')}
            />
            {renderFieldError('artist')}
          </div>
          <div className="field full">
            <label htmlFor="message">Tell us about it *</label>
            <textarea
              id="message"
              name="message"
              required
              maxLength={5000}
              placeholder="Share your goals, event details, opportunity, or project..."
              {...fieldA11y('message')}
            />
            {renderFieldError('message')}
          </div>
          <div className="honeypot" aria-hidden="true">
            <label htmlFor="website">Website</label>
            <input
              id="website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
            />
          </div>
        </div>
        <button className="btn" type="submit" disabled={state === 'submitting'}>
          {state === 'submitting' ? form.submittingLabel : form.submitLabel}{' '}
          <span>↗</span>
        </button>
        <p className="form-note">{form.note}</p>
        {state === 'success' ? (
          <div className="success" role="status">
            {form.successMessage}
          </div>
        ) : null}
        {state === 'error' ? (
          <div className="form-error" role="alert">
            {errorMessage}
          </div>
        ) : null}
      </form>
    </div>
  );
}
