import { motion } from "framer-motion";

const partners = [
  { name: "Central Bank of Kenya", abbr: "CBK" },
  { name: "SASRA", abbr: "SASRA" },
  { name: "Kenya Bankers", abbr: "KBA" },
  { name: "KUSCCO", abbr: "KUSCCO" },
  { name: "Co-operative Alliance", abbr: "CoopA" },
  { name: "Safaricom M-Pesa", abbr: "M-Pesa" },
  { name: "Equity Bank", abbr: "Equity" },
  { name: "KCB Group", abbr: "KCB" },
  { name: "CIC Insurance", abbr: "CIC" },
  { name: "ICEA Lion", abbr: "ICEA" },
];

const doubledPartners = [...partners, ...partners];

export const PartnersTickerSection = () => {
  return (
    <section className="py-16 overflow-hidden border-y border-border/30">
      <div className="container mb-10 text-center">
        <span className="text-primary text-sm font-medium uppercase tracking-wider">
          Our Partners
        </span>
        <h2 className="font-display text-3xl md:text-4xl font-bold mt-3">
          Trusted <span className="text-gradient-gold">Partnerships</span>
        </h2>
        <p className="text-muted-foreground mt-3 max-w-lg mx-auto">
          Working with leading financial institutions and regulatory bodies across Kenya.
        </p>
      </div>

      {/* Ticker row 1 */}
      <div className="relative">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
        <motion.div
          className="flex gap-6"
          animate={{ x: [0, -50 * partners.length] }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {doubledPartners.map((partner, i) => (
            <div
              key={`${partner.abbr}-${i}`}
              className="flex-shrink-0 w-48 h-24 glass-card flex flex-col items-center justify-center gap-2 hover:border-primary/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold text-sm">{partner.abbr.slice(0, 2)}</span>
              </div>
              <span className="text-xs text-muted-foreground font-medium text-center px-2 leading-tight">
                {partner.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Ticker row 2 — reverse */}
      <div className="relative mt-6">
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
        <motion.div
          className="flex gap-6"
          animate={{ x: [-50 * partners.length, 0] }}
          transition={{ duration: 35, repeat: Infinity, ease: "linear" }}
        >
          {doubledPartners.map((partner, i) => (
            <div
              key={`rev-${partner.abbr}-${i}`}
              className="flex-shrink-0 w-48 h-24 glass-card flex flex-col items-center justify-center gap-2 hover:border-primary/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <span className="text-accent font-bold text-sm">{partner.abbr.slice(0, 2)}</span>
              </div>
              <span className="text-xs text-muted-foreground font-medium text-center px-2 leading-tight">
                {partner.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
