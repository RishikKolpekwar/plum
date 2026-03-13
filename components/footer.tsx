import Link from "next/link"
import { IconBrandLinkedin, IconBrandTwitter, IconBrandInstagram } from "@tabler/icons-react"
import { PlumLogo } from "@/components/plum-logo"

export function Footer() {
  return (
    <footer className="bg-background border-t border-border">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <PlumLogo className="w-9 h-9" />
              <span className="font-serif text-xl font-bold">
                <span>plum</span>
              </span>
            </div>
            <p className="text-muted-foreground leading-relaxed max-w-md">
              Rhode Island&apos;s plumber, on demand.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="#services" className="text-muted-foreground hover:text-primary transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link href="#pricing" className="text-muted-foreground hover:text-primary transition-colors">
                  Plans
                </Link>
              </li>
              <li>
                <Link href="#process" className="text-muted-foreground hover:text-primary transition-colors">
                  Book a Visit
                </Link>
              </li>
              <li>
                <Link href="/dashboard" className="text-muted-foreground hover:text-primary transition-colors">
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Service Area */}
          <div>
            <h3 className="font-semibold mb-4">Service Area</h3>
            <p className="text-muted-foreground leading-relaxed">
              Serving Woonsocket, Providence, Smithfield &amp; N. Smithfield, Rhode Island
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 plum. Rhode Island&apos;s plumbing.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <IconBrandLinkedin className="w-5 h-5" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Twitter"
            >
              <IconBrandTwitter className="w-5 h-5" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-colors"
              aria-label="Instagram"
            >
              <IconBrandInstagram className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
