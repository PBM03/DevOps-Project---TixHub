import { Link } from "react-router-dom";
import { Ticket, Twitter, Instagram, Facebook } from "lucide-react";

export const Footer = () => (
  <footer className="border-t border-border/50 mt-24 bg-card/30">
    <div className="container py-12 grid gap-10 md:grid-cols-4">
      <div className="space-y-3">
        <Link to="/" className="flex items-center gap-2">
          <div className="size-9 rounded-xl gradient-primary grid place-items-center">
            <Ticket className="size-5 text-primary-foreground" />
          </div>
          <span className="font-display text-xl font-bold">
            Tix<span className="gradient-text">Hub</span>
          </span>
        </Link>
        <p className="text-sm text-muted-foreground max-w-xs">
          The premium destination for discovering and booking unforgettable live experiences.
        </p>
      </div>
      {[
        { title: "Explore", links: [["Events", "/events"], ["Concerts", "/events?category=Concerts"], ["Comedy", "/events?category=Comedy"], ["Sports", "/events?category=Sports"]] },
        { title: "Account", links: [["Login", "/login"], ["Sign up", "/signup"], ["Dashboard", "/dashboard"], ["Wishlist", "/wishlist"]] },
        { title: "Support", links: [["Help center", "#"], ["Contact us", "#"], ["Refund policy", "#"], ["Terms", "#"]] },
      ].map((col) => (
        <div key={col.title}>
          <h4 className="font-semibold mb-4 text-sm">{col.title}</h4>
          <ul className="space-y-2">
            {col.links.map(([label, href]) => (
              <li key={label}>
                <Link to={href} className="text-sm text-muted-foreground hover:text-foreground transition-smooth">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    <div className="border-t border-border/50">
      <div className="container py-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">© 2026 TixHub. All rights reserved.</p>
        <div className="flex gap-3">
          {[Twitter, Instagram, Facebook].map((Icon, i) => (
            <a key={i} href="#" className="size-9 rounded-lg grid place-items-center bg-secondary hover:bg-primary hover:text-primary-foreground transition-smooth">
              <Icon className="size-4" />
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);
