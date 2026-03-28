import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { COMPANY, DISCLAIMER_LINES } from "@/lib/constants";

export default function SiteFooter() {
  return (
    <footer data-testid="site-footer" className="border-t border-white/[0.06] bg-black relative overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 relative z-10">
        <div className="grid gap-10 md:grid-cols-5">
          {/* Brand */}
          <div className="md:col-span-2">
            <img src="/ao_logo_white.png" alt="Agile Ortho" className="h-10 w-auto" />
            <p data-testid="footer-tagline" className="mt-2 text-xs font-bold text-[#D4AF37] tracking-[0.2em] uppercase">
              {COMPANY.tagline}
            </p>
            <p data-testid="footer-subtitle" className="mt-4 max-w-md text-sm leading-relaxed text-white/40">
              Authorized Meril Life Sciences master distributor serving hospitals, clinics, and diagnostic centers across all 33 districts of Telangana.
            </p>
            <div className="mt-6 space-y-2.5">
              <a href={`tel:${COMPANY.phone}`} className="flex items-center gap-2.5 text-sm text-white/40 hover:text-white transition-colors">
                <Phone size={13} className="text-[#D4AF37]" /> {COMPANY.phone}
              </a>
              <a href={`https://wa.me/${COMPANY.whatsapp.replace("+", "")}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm text-white/40 hover:text-white transition-colors">
                <MessageCircle size={13} className="text-[#D4AF37]" /> {COMPANY.whatsapp} (WhatsApp)
              </a>
              <a href={`mailto:${COMPANY.email}`} className="flex items-center gap-2.5 text-sm text-white/40 hover:text-white transition-colors">
                <Mail size={13} className="text-[#D4AF37]" /> {COMPANY.email}
              </a>
              <div className="flex items-start gap-2.5 text-sm text-white/40">
                <MapPin size={13} className="text-[#D4AF37] mt-0.5 shrink-0" /> {COMPANY.address}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <div className="text-xs font-bold text-[#D4AF37] tracking-[0.15em] uppercase mb-5">Quick Links</div>
            <ul className="space-y-3">
              <li><Link to="/catalog" className="text-sm text-white/40 hover:text-white transition-colors">Products</Link></li>
              <li><Link to="/districts" className="text-sm text-white/40 hover:text-white transition-colors">Districts</Link></li>
              <li><Link to="/about" className="text-sm text-white/40 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-sm text-white/40 hover:text-white transition-colors">Contact</Link></li>
              <li><Link to="/chat" className="text-sm text-white/40 hover:text-white transition-colors">AI Assistant</Link></li>
              <li><a href="https://www.agileortho.shop" target="_blank" rel="noreferrer" className="text-sm text-white/40 hover:text-white transition-colors">Online Shop</a></li>
            </ul>
          </div>

          {/* Key Districts */}
          <div>
            <div className="text-xs font-bold text-[#D4AF37] tracking-[0.15em] uppercase mb-5">Key Districts</div>
            <ul className="space-y-3">
              <li><Link to="/districts/hyderabad" className="text-sm text-white/40 hover:text-white transition-colors">Hyderabad</Link></li>
              <li><Link to="/districts/warangal" className="text-sm text-white/40 hover:text-white transition-colors">Warangal</Link></li>
              <li><Link to="/districts/karimnagar" className="text-sm text-white/40 hover:text-white transition-colors">Karimnagar</Link></li>
              <li><Link to="/districts/nizamabad" className="text-sm text-white/40 hover:text-white transition-colors">Nizamabad</Link></li>
              <li><Link to="/districts/khammam" className="text-sm text-white/40 hover:text-white transition-colors">Khammam</Link></li>
              <li><Link to="/districts" className="text-sm text-[#2DD4BF] hover:text-[#5EEAD4] transition-colors font-medium">All 33 Districts &rarr;</Link></li>
            </ul>
          </div>

          {/* Compliance */}
          <div>
            <div data-testid="footer-disclaimer-title" className="text-xs font-bold text-[#D4AF37] tracking-[0.15em] uppercase mb-5">Compliance</div>
            <ul className="space-y-2.5">
              {DISCLAIMER_LINES.map((line) => (
                <li key={line} className="text-xs text-white/30 flex items-start gap-2">
                  <span className="w-1 h-1 rounded-full bg-[#D4AF37] mt-1.5 shrink-0" />
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/[0.06] pt-6 sm:flex-row">
          <div data-testid="footer-bottom" className="text-xs text-white/25">
            &copy; {new Date().getFullYear()} {COMPANY.legalName}. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-xs text-white/25">
            <span>GST: {COMPANY.gst}</span>
            <span className="h-1 w-1 rounded-full bg-white/10" />
            <span>CIN Registered</span>
          </div>
        </div>
      </div>

      {/* Giant brand watermark */}
      <div className="absolute bottom-0 left-0 right-0 text-center overflow-hidden pointer-events-none select-none" aria-hidden="true">
        <span className="text-[12vw] font-bold tracking-tighter text-white/[0.02] leading-none" style={{ fontFamily: 'Outfit' }}>
          AGILE ORTHO
        </span>
      </div>
    </footer>
  );
}
