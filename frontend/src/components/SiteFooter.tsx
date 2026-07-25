import Link from 'next/link';

export default function SiteFooter() {
  return (
    <footer className="py-32 border-t border-white/5 bg-black">
      <div className="max-w-7xl mx-auto px-4 text-center">
        <div className="text-4xl font-black tracking-tighter uppercase italic mb-8">
          AGILE <span className="text-primary">HEALTHCARE</span>
        </div>
        <p className="text-muted-foreground mb-12 max-w-xl mx-auto">
          Authorized Master Franchise Distributor for Meril Life Sciences. Serving the future of surgery in Telangana.
        </p>
        <div className="flex justify-center gap-12 text-[10px] font-black uppercase tracking-widest text-white/40 flex-wrap mb-10">
          <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
          <Link href="/contact" className="hover:text-primary transition-colors">Contact</Link>
          <Link href="/catalog" className="hover:text-primary transition-colors">Catalog</Link>
          <Link href="/insights" className="hover:text-primary transition-colors">Insights</Link>
          <Link href="/districts" className="hover:text-primary transition-colors">Districts</Link>
        </div>
        <div className="pt-10 border-t border-white/5 max-w-md mx-auto">
          <div className="text-[10px] uppercase tracking-widest text-white/25 mb-4">Our Stores</div>
          <div className="flex justify-center gap-8 text-xs font-semibold uppercase tracking-wide text-white/40 flex-wrap">
            <a href="https://agilehealthcare.shop" className="hover:text-primary transition-colors">
              Diagnostics Store
            </a>
            <a href="https://agileortho.shop" className="hover:text-primary transition-colors">
              Implants Store
            </a>
            <a href="https://www.agileortho.in" className="hover:text-primary transition-colors">
              Agile Ortho
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
