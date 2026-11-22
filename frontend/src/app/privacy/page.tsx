import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/content/site';
import { graph, webPage } from '@/content/schema';
import JsonLd from '@/components/JsonLd';
import LegalPage from '../about/LegalPage';

export const metadata: Metadata = { title: 'Privacy policy', alternates: { canonical: '/privacy' } };

export default function Privacy() {
  const g = site.grievance;
  return (
    <>
      <JsonLd data={graph(webPage('/privacy', 'Privacy policy'))} />
      <LegalPage
        eyebrow="Privacy policy"
        title="What we do with the details you give us."
        lead={<>This policy is from {site.legalName}, trading as {site.name}.</>}
        updated="16 November 2026"
        sections={[
          { h: 'What we collect', body: <>
            <p>This website has no forms and no login. It does not set cookies for tracking.</p>
            <p>When you message, call or email us, we keep your name, phone number or email, hospital or lab, and the device you ask for. This is usually the device, the hospital and the case date.</p>
          </> },
          { h: 'Do not send patient details', body: <p>Do not send patient names, patient photos or patient records. We do not need them to supply a device. If you send them by mistake, tell us and we delete them.</p> },
          { h: 'How we use it', body: <>
            <p>We use your details only to answer you, to supply and deliver the device, to bill, and to meet our legal duties, such as tax records and device recalls.</p>
            <p>We do not sell your details. We share them only with people who help us do this work, such as our delivery staff and our accounts software, or when the law asks us to.</p>
            <p>Messages you send on WhatsApp also pass through WhatsApp, under its own terms.</p>
          </> },
          { h: 'How long we keep it', body: <p>We keep order and billing records only as long as tax and recall rules require. Then we delete them. We keep other messages only as long as we need them to answer you.</p> },
          { h: 'Your choices', body: <p>You can ask us to see, correct or delete your details, or withdraw your consent. Write to our grievance officer. If we do not resolve it, you can go to the Data Protection Board of India under the Digital Personal Data Protection Act, 2023.</p> },
          { h: 'Grievance officer', body: <>
            <p>
              {g.name}, <a href={`mailto:${g.email}`}>{g.email}</a>, <a href={`tel:${g.tel}`}>{g.display}</a>.
              We reply within {g.replyDays} days.
            </p>
            <p className="muted small">Office: {site.address.oneLine}. See also our <Link href="/terms">terms of use</Link>.</p>
          </> },
        ]}
      />
    </>
  );
}
