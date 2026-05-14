
import  Link from "next/link";
export function Footer() {
  return (
    <footer className="bg-foreground text-background py-16">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-lg">D</span>
              </div>
              <span className="font-display font-bold text-xl">Darak</span>
            </Link>
            <p className="text-muted-foreground text-sm">
              Egypt's premium real estate marketplace for buying properties.
            </p>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/search?status=ready" className="hover:text-background">Ready Properties</Link></li>
              <li><Link href="/search?status=offplan" className="hover:text-background">Off-Plan Properties</Link></li>
              <li><Link href="/pricing" className="hover:text-background">Advertiser Plans</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Top Areas</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/search?city=Cairo" className="hover:text-background">New Cairo</Link></li>
              <li><Link href="/search?city=Giza" className="hover:text-background">6th of October</Link></li>
              <li><Link href="/search?city=North%20Coast" className="hover:text-background">North Coast</Link></li>
              <li><Link href="/search?city=New%20Capital" className="hover:text-background">New Capital</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Cairo, Egypt</li>
              <li>info@darak.eg</li>
              <li>+20 100 000 0000</li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-muted-foreground/20 mt-12 pt-8 text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} Darak. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
