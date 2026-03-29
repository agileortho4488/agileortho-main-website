/**
 * Conversion tracking utilities for Meta Pixel and Google Ads.
 * Fires events on lead capture form submissions.
 */

// Meta Pixel: Track lead conversion
export function trackMetaLead(leadData = {}) {
  if (typeof window.fbq === "function") {
    window.fbq("track", "Lead", {
      content_name: leadData.product_interest || "General Enquiry",
      content_category: leadData.department || "Medical Devices",
      value: 1,
      currency: "INR",
    });
  }
}

// Google Ads: Track conversion
export function trackGoogleConversion(leadData = {}) {
  if (typeof window.gtag === "function") {
    window.gtag("event", "conversion", {
      send_to: window.__GADS_CONVERSION_ID || "AW-PLACEHOLDER/PLACEHOLDER",
      value: 1.0,
      currency: "INR",
    });
  }
}

// GA4: Track lead event (already configured via G-MXXC41JFLG)
export function trackGA4Lead(leadData = {}) {
  if (typeof window.gtag === "function") {
    window.gtag("event", "generate_lead", {
      event_category: "Lead",
      event_label: leadData.inquiry_type || "General",
      department: leadData.department || "",
      district: leadData.district || "",
      source: leadData.source || "website",
    });
  }
}

// Fire all tracking events on lead capture
export function trackLeadConversion(leadData = {}) {
  trackMetaLead(leadData);
  trackGoogleConversion(leadData);
  trackGA4Lead(leadData);
}
