import { Link } from "react-router-dom";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

const DIVISIONS = [
  "Orthopedics", "Trauma", "Cardiovascular", "Diagnostics",
  "ENT", "Endo-surgical", "Infection Prevention", "Peripheral Intervention"
];

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300" data-testid="site-footer">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Main footer */}
        <div className="py-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-sm bg-emerald-600 flex items-center justify-center">
                <span className="text-white font-black text-sm" style={{ fontFamily: "Chivo" }}>M</span>
              </div>
              <div>
                <span className="text-base font-black text-white" style={{ fontFamily: "Chivo" }}>MedDevice</span>
                <span className="text-base font-light text-emerald-400" style={{ fontFamily: "Chivo" }}>Pro</span>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-slate-400 mb-4">
              Authorized Meril Life Sciences master franchise distributor for Telangana.
              Delivering world-class medical devices to hospitals and clinics across all 33 districts.
            </p>
            <a
              href="https://wa.me/919876543210?text=Hi, I'm interested in Meril medical devices"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#25D366] text-white text-sm font-semibold rounded-sm hover:bg-[#1DA851] transition-colors"
              data-testid="footer-whatsapp-btn"
            >
              <MessageCircle size={16} /> Chat on WhatsApp
            </a>
          </div>

          {/* Divisions */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-[0.2em] mb-4">Product Divisions</h4>
            <ul className="space-y-2">
              {DIVISIONS.map((d) => (
                <li key={d}>
                  <Link to={`/products?division=${encodeURIComponent(d)}`} className="text-sm text-slate-400 hover:text-white transition-colors">
                    {d}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-[0.2em] mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/products" className="text-sm text-slate-400 hover:text-white transition-colors">All Products</Link></li>
              <li><Link to="/about" className="text-sm text-slate-400 hover:text-white transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-sm text-slate-400 hover:text-white transition-colors">Contact & Quotes</Link></li>
              <li><Link to="/admin/login" className="text-sm text-slate-400 hover:text-white transition-colors">Admin Portal</Link></li>
            </ul>
          </div>

          {/* Contact & Regulatory */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-[0.2em] mb-4">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-2">
                <MapPin size={14} className="mt-0.5 shrink-0 text-emerald-400" />
                <span className="text-slate-400">Plot No. 42, Industrial Area,<br />Hyderabad, Telangana 500032</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone size={14} className="shrink-0 text-emerald-400" />
                <a href="tel:+919876543210" className="text-slate-400 hover:text-white transition-colors">+91 98765 43210</a>
              </li>
              <li className="flex items-center gap-2">
                <Mail size={14} className="shrink-0 text-emerald-400" />
                <a href="mailto:info@meddevicepro.in" className="text-slate-400 hover:text-white transition-colors">info@meddevicepro.in</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Regulatory bar */}
        <div className="border-t border-slate-800 py-6" data-testid="regulatory-footer">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-500">
            <div>
              <span className="uppercase tracking-[0.15em] text-slate-600 font-bold">Wholesale Drug License</span>
              <p className="mt-1 font-mono text-slate-400">MD-42/2024/WH-TG/001234</p>
            </div>
            <div>
              <span className="uppercase tracking-[0.15em] text-slate-600 font-bold">GST Registration</span>
              <p className="mt-1 font-mono text-slate-400">36AABCT1234F1ZQ</p>
            </div>
            <div>
              <span className="uppercase tracking-[0.15em] text-slate-600 font-bold">Certifications</span>
              <p className="mt-1 text-slate-400">ISO 13485:2016 Certified Distributor</p>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-600">
          &copy; {new Date().getFullYear()} MedDevice Pro. Authorized Meril Life Sciences distributor for Telangana.
        </div>
      </div>
    </footer>
  );
};
