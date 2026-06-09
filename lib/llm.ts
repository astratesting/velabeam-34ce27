import { env } from './env';
import { getIndustryLabel, type IndustryKey } from './industry';

export interface GeneratedContent {
  businessName: string;
  tagline: string;
  sections: SiteSection[];
  colorOverride?: string;
}

export interface SiteSection {
  type: 'hero' | 'services' | 'about' | 'testimonials' | 'contact';
  heading: string;
  body: string;
  items?: { title: string; description: string }[];
  cta?: { label: string; href: string };
}

export async function generateSiteContent(params: {
  businessName: string;
  industry: IndustryKey;
  address: string;
  phone?: string | null;
  tagline?: string;
}): Promise<GeneratedContent> {
  if (!env.OPENAI_API_KEY) {
    return generateStubContent(params);
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a website copywriter for local businesses. Generate JSON website content for a ${getIndustryLabel(params.industry)} business. Return valid JSON only with this structure: { "businessName": string, "tagline": string, "sections": [{"type": "hero"|"services"|"about"|"testimonials"|"contact", "heading": string, "body": string, "items"? : [{"title": string, "description": string}], "cta"? : {"label": string, "href": string}}] }`,
          },
          {
            role: 'user',
            content: `Generate website content for:\nBusiness: ${params.businessName}\nIndustry: ${getIndustryLabel(params.industry)}\nAddress: ${params.address}\n${params.phone ? `Phone: ${params.phone}` : ''}`,
          },
        ],
        temperature: 0.7,
        response_format: { type: 'json_object' },
      }),
    });

    if (!response.ok) throw new Error('LLM API error');
    const data = await response.json();
    const content = JSON.parse(data.choices[0].message.content);
    return content as GeneratedContent;
  } catch {
    return generateStubContent(params);
  }
}

function generateStubContent(params: {
  businessName: string;
  industry: IndustryKey;
  address: string;
  phone?: string | null;
  tagline?: string;
}): GeneratedContent {
  const industryLabel = getIndustryLabel(params.industry);

  return {
    businessName: params.businessName,
    tagline: params.tagline ?? `Your trusted ${industryLabel.toLowerCase()} in the community`,
    sections: [
      {
        type: 'hero',
        heading: `Welcome to ${params.businessName}`,
        body: `We are a locally owned ${industryLabel.toLowerCase()} dedicated to serving our community with quality and care.`,
        cta: { label: 'Get in Touch', href: '#contact' },
      },
      {
        type: 'services',
        heading: 'Our Services',
        body: `We offer a comprehensive range of ${industryLabel.toLowerCase()} services tailored to your needs.`,
        items: [
          { title: 'Consultation', description: 'Personalized service to understand your needs' },
          { title: 'Core Service', description: `Professional ${industryLabel.toLowerCase()} services` },
          { title: 'Follow-up', description: 'Ongoing support and maintenance' },
        ],
      },
      {
        type: 'about',
        heading: 'About Us',
        body: `${params.businessName} has been proudly serving the local community. Our experienced team is committed to delivering excellence in everything we do.`,
      },
      {
        type: 'testimonials',
        heading: 'What Our Clients Say',
        body: 'We value every relationship we build with our clients.',
        items: [
          { title: 'Outstanding Service', description: 'Professional, reliable, and always on time.' },
          { title: 'Highly Recommended', description: 'Best in the area — will definitely come back.' },
        ],
      },
      {
        type: 'contact',
        heading: 'Get in Touch',
        body: `Visit us at ${params.address}${params.phone ? ` or call ${params.phone}` : ''}. We look forward to hearing from you.`,
        cta: { label: 'Contact Us', href: `mailto:hello@${params.businessName.toLowerCase().replace(/\s+/g, '')}.com` },
      },
    ],
  };
}
