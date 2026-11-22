import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/content/site';
import { graph, webPage } from '@/content/schema';
import JsonLd from '@/components/JsonLd';
import LegalPage from '../about/LegalPage';

export const metadata: Metadata = { title: 'Terms of use', alternates: { canonical: '/terms' } };

export default function Terms() {
  const g = site.grievance;
  return (
    <>
      <JsonLd data={graph(webPage('/terms', 'Terms of use'))} />
      <LegalPage
        eyebrow="Terms of use"
        title="The rules for using this website."
        lead={<>This website belongs to {site.legalName}, trading as {site.name}. CIN {site.cin}.</>}
        sections={[
          { h: 'Who this website is for', body: <p>This website is for hospitals, labs and healthcare professionals in Telangana. We supply in Telangana only.</p> },
          { h: 'Not medical advice', body: <p>The pages say what a device is and how it is generally used. They are not medical advice. The surgeon or doctor decides which device to use and how.</p> },
          { h: 'Not an offer for sale', body: <p>The pages are not an offer for sale. What we can supply, and when, is confirmed on WhatsApp or in writing for each case.</p> },
          { h: 'Names and pictures', body: <p>All trademarks belong to their owners. Photos are credited in the footer of each page.</p> },
          { h: 'Your details', body: <p>Our <Link href="/privacy">privacy policy</Link> says what we do with the details you give us.</p> },
          { h: 'Changes', body: <p>We may change these pages and these terms. The version on this website is the current one.</p> },
          { h: 'Questions or complaints', body: <>
            <p>
              Grievance officer: {g.name}, <a href={`mailto:${g.email}`}>{g.email}</a>, <a href={`tel:${g.tel}`}>{g.display}</a>.
              We reply within {g.replyDays} days.
            </p>
            <p>These terms follow the laws of India. Courts in Hyderabad, Telangana, hear any dispute.</p>
          </> },
        ]}
      />
    </>
  );
}
