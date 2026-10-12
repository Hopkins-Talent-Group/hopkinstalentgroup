'use client';

import { useState } from 'react';
import { site } from '@/data/site';

const { form } = site.contact;

type SubmitState = 'idle' | 'submitting' | 'success' | 'error';

export default function InquiryForm() {
  const [state, setState] = useState<SubmitState>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

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

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        formElement.reset();
        setState('success');
        return;
      }

      let message = form.errorMessage;
      try {
        const body = (await response.json()) as { error?: unknown };
        if (response.status === 429 && typeof body.error === 'string') {
          message = body.error;
        }
      } catch {
        // Keep the generic message when the body is not JSON.
      }

      setErrorMessage(message);
      setState('error');
    } catch {
      setErrorMessage(form.errorMessage);
      setState('error');
    }
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
            />
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
            />
          </div>
          <div className="field">
            <label htmlFor="inquiry">Inquiry type *</label>
            <select id="inquiry" name="inquiry" required defaultValue={form.inquiryTypes[0]}>
              {form.inquiryTypes.map((type) => (
                <option value={type} key={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="artist">Artist / company</label>
            <input
              id="artist"
              name="artist"
              maxLength={150}
              placeholder="If applicable"
            />
          </div>
          <div className="field full">
            <label htmlFor="message">Tell us about it *</label>
            <textarea
              id="message"
              name="message"
              required
              maxLength={5000}
              placeholder="Share your goals, event details, opportunity, or project..."
            />
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
