'use client';

import Script from 'next/script';
import { site } from '@/data/site';

const { form } = site.contact;

export default function InquiryForm() {
  return (
    <div className="form-card">
      <h3>{form.title}</h3>
      <p>{form.intro}</p>

      <iframe
        src="https://api.leadconnectorhq.com/widget/form/umVjH2kbBRXgsmN4f7Vr"
        style={{
          width: '100%',
          height: '819px',
          border: 'none',
          borderRadius: '8px',
        }}
        id="inline-umVjH2kbBRXgsmN4f7Vr"
        data-layout='{"id":"INLINE"}'
        data-trigger-type="alwaysShow"
        data-trigger-value=""
        data-activation-type="alwaysActivated"
        data-activation-value=""
        data-deactivation-type="neverDeactivate"
        data-deactivation-value=""
        data-form-name="HTG Form"
        data-height="819"
        data-layout-iframe-id="inline-umVjH2kbBRXgsmN4f7Vr"
        data-form-id="umVjH2kbBRXgsmN4f7Vr"
        title="HTG Form"
      />

      <Script
        src="https://link.msgsndr.com/js/form_embed.js"
        strategy="afterInteractive"
      />
    </div>
  );
}
