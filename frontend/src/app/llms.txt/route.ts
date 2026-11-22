import { SITE_URL, site } from '@/content/site';
import { departments } from '@/content/departments';
import { devices, deviceHref } from '@/content/devices';

export const dynamic = 'force-static';

// Plain-text summary for AI readers, built from the same content as the pages.
export function GET() {
  const lines = [
    `# ${site.name}`,
    '',
    `> ${site.name} is the trading name of ${site.legalName}. ${site.description}`,
    '',
    `- WhatsApp: ${site.whatsapp.display} (${site.whatsapp.url})`,
    `- ${site.emergencyLine}`,
    `- Email: ${site.email}`,
    `- Office: ${site.address.oneLine}`,
    `- CIN ${site.cin}; GSTIN ${site.gstin}; Drug licence: DL No. ${site.drugLicence}; Udyam (MSME): ${site.udyam}`,
    '',
    '## Pages',
    `- [Devices A to Z](${SITE_URL}/devices): every device with a one-line definition`,
    `- [How we deliver](${SITE_URL}/how-we-deliver): how a set is packed, delivered and collected`,
    `- [About](${SITE_URL}/about)`,
    `- [Contact](${SITE_URL}/contact)`,
    '',
    '## Departments',
    ...departments.map(d => `- [${d.name}](${SITE_URL}/departments/${d.slug}): ${d.line}`),
    '',
    '## Devices',
    ...[...devices]
      .sort((a, b) => a.name.localeCompare(b.name))
      .map(d => `- [${d.name}](${SITE_URL}${deviceHref(d)})${d.alsoCalled.length ? ` (also called ${d.alsoCalled.join(', ')})` : ''}: ${d.short}`),
    '',
    site.disclaimer,
    '',
  ];
  return new Response(lines.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
