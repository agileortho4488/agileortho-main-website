import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, MessageCircle } from "lucide-react";
import { COMPANY } from "@/lib/constants";

function NavItem({ to, children, testId, onClick }) {
  return (
    <NavLink
      data-testid={testId}
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `text-sm font-medium tracking-wide transition-colors ${
          isActive ? "text-[#D4AF37]" : "text-white/80 hover:text-white"
        }`
      }
    >
      {children}
    </NavLink>
  );
}

export default function SiteHeader() {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header
      data-testid="site-header"
      className="sticky top-0 z-50 border-b border-white/[0.06] bg-[#0A0A0A]/80 backdrop-blur-xl supports-[backdrop-filter]:bg-[#0A0A0A]/70"
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link data-testid="site-logo-link" to="/" className="flex items-center gap-2.5">
          <img src="/ao_logo_white.png" alt="Agile Ortho" className="h-8 sm:h-9 w-auto" data-testid="site-logo-mark" />
        </Link>

        <nav data-testid="site-nav" className="hidden items-center gap-8 md:flex">
          <NavItem testId="nav-products-link" to="/catalog">Products</NavItem>
          <NavItem testId="nav-districts-link" to="/districts">Districts</NavItem>
          <NavItem testId="nav-about-link" to="/about">About</NavItem>
          <NavItem testId="nav-contact-link" to="/contact">Contact</NavItem>
          <NavItem testId="nav-chat-link" to="/chat">AI Assistant</NavItem>
          <a
            data-testid="nav-shop-link"
            href="https://www.agileortho.shop"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium text-white/80 transition-colors hover:text-white tracking-wide"
          >
            Shop
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <a
            href={`https://wa.me/${COMPANY.whatsapp.replace("+", "")}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-2 rounded-sm bg-[#D4AF37] px-5 py-2 text-sm font-semibold text-black hover:bg-[#F2C94C] transition-colors"
            data-testid="header-whatsapp-btn"
          >
            <MessageCircle size={14} strokeWidth={2} /> WhatsApp
          </a>

          <button
            data-testid="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-sm border border-white/10 bg-white/5 text-white md:hidden"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div data-testid="mobile-menu" className="border-t border-white/[0.06] bg-[#0A0A0A] px-4 py-5 md:hidden">
          <nav className="flex flex-col gap-5">
            <NavItem testId="nav-products-link-mobile" to="/catalog" onClick={() => setMobileMenuOpen(false)}>Products</NavItem>
            <NavItem testId="nav-districts-link-mobile" to="/districts" onClick={() => setMobileMenuOpen(false)}>Districts</NavItem>
            <NavItem testId="nav-about-link-mobile" to="/about" onClick={() => setMobileMenuOpen(false)}>About</NavItem>
            <NavItem testId="nav-contact-link-mobile" to="/contact" onClick={() => setMobileMenuOpen(false)}>Contact</NavItem>
            <NavItem testId="nav-chat-link-mobile" to="/chat" onClick={() => setMobileMenuOpen(false)}>AI Assistant</NavItem>
            <a href="https://www.agileortho.shop" target="_blank" rel="noreferrer" onClick={() => setMobileMenuOpen(false)} className="text-sm font-medium text-white/60">Shop</a>
            <a
              href={`https://wa.me/${COMPANY.whatsapp.replace("+", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 w-full flex items-center justify-center gap-2 rounded-sm bg-[#D4AF37] px-5 py-3 text-sm font-semibold text-black"
            >
              <MessageCircle size={14} /> WhatsApp Us
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
