// The 2020 Gmail mark (Google's four colours), as published on Wikimedia Commons. The colours are fixed paint,
// not theme variables. Hex is stored without the # like the simple-icons data used elsewhere.
const PARTS = [
  { fill: "4285f4", d: "M58 108h14V74L52 59v43c0 3.32 2.69 6 6 6" },
  { fill: "34a853", d: "M120 108h14c3.32 0 6-2.69 6-6V59l-20 15" },
  { fill: "fbbc04", d: "M120 48v26l20-15v-8c0-7.42-8.47-11.65-14.4-7.2" },
  { fill: "ea4335", d: "M72 74V48l24 18 24-18v26L96 92" },
  { fill: "c5221f", d: "M52 51v8l20 15V48l-5.6-4.2c-5.94-4.45-14.4-.22-14.4 7.2" },
] as const;

export function GmailLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="52 42 88 66" aria-hidden="true" className={className}>
      {PARTS.map((p) => (
        <path key={p.fill} fill={`#${p.fill}`} d={p.d} />
      ))}
    </svg>
  );
}
