'use client';

import { useState } from 'react';
import { site } from '@/data/site';

const { form } = site.contact;

export default function InquiryForm() {
  const [status, setStatus] = useState('');

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const data = new FormData(event.currentTarget);
    const recipient = site.inquiryRecipientEmail;
    const subject = encodeURIComponent(`HTG inquiry — ${data.get('inquiry')}`);
    const body = encodeURIComponent(
      [
        `Name: ${data.get('name')}`,
        `Email: ${data.get('email')}`,
        `Inquiry: ${data.get('inquiry')}`,
        `Artist / Company: ${data.get('artist') || 'Not provided'}`,
        '',
        'Details:',
        data.get('message'),
      ].join('\n'),
    );

    if (recipient) {
      setStatus(form.successWithRecipient);
      window.location.href = `mailto:${recipient}?subject=${subject}&body=${body}`;
      return;
    }

    setStatus(form.successNoRecipient);
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
            <input id="artist" name="artist" placeholder="If applicable" />
          </div>
          <div className="field full">
            <label htmlFor="message">Tell us about it *</label>
            <textarea
              id="message"
              name="message"
              required
              placeholder="Share your goals, event details, opportunity, or project..."
            />
          </div>
        </div>
        <button className="btn" type="submit">
          {form.submitLabel} <span>↗</span>
        </button>
        <p className="form-note">{form.note}</p>
        {status ? (
          <div className="success" role="status" style={{ display: 'block' }}>
            {status}
          </div>
        ) : null}
      </form>
    </div>
  );
}
