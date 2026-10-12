// The 2026 Gmail mark, as published on Wikimedia Commons (Gmail_icon_(2026).svg): a flat red left stripe, a
// green-to-blue right stripe and a pink-to-yellow top arc, the two gradients kept exactly as in the source.
// The colours are fixed paint, not theme variables. Hex is stored without the # like the simple-icons data used
// elsewhere. The gradient ids are document-global, so render one instance per page.

// [offset, hex]
const RIGHT_STRIPE: readonly (readonly [number, string])[] = [
  [0, "60d673"],
  [0.17, "42c868"],
  [0.39, "0ebc5f"],
  [0.62, "00a9bb"],
  [0.86, "3c90ff"],
  [1, "3186ff"],
];
const TOP_ARC: readonly (readonly [number, string])[] = [
  [0.08, "ff63a0"],
  [0.3, "fc413d"],
  [0.5, "fc413d"],
  [0.65, "fc413d"],
  [0.72, "fc5c30"],
  [0.86, "feb10c"],
  [0.91, "fec700"],
  [0.96, "ffdb0f"],
];
const LEFT_STRIPE = "fc413d";

// Both gradients share the source's transform, which maps its 0-184 design grid onto the 800-wide canvas.
const GRID = "matrix(4.5454426,0,0,4.5454426,-36.362684,-118.18025)";

export function GmailLogo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 800 636.36322" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id="gmail-a" x1="165" x2="165" y1="44" y2="166" gradientUnits="userSpaceOnUse" gradientTransform={GRID}>
          {RIGHT_STRIPE.map(([offset, hex]) => (
            <stop key={offset} offset={offset} stopColor={`#${hex}`} />
          ))}
        </linearGradient>
        <linearGradient id="gmail-b" x1="8" x2="184" y1="46.130001" y2="46.130001" gradientUnits="userSpaceOnUse" gradientTransform={GRID}>
          {TOP_ARC.map(([offset, hex]) => (
            <stop key={offset} offset={offset} stopColor={`#${hex}`} />
          ))}
        </linearGradient>
      </defs>
      <path
        fill="url(#gmail-a)"
        d="M 627.27193,81.819216 H 799.99875 V 581.8179 c 0,30.12265 -24.42266,54.54532 -54.54531,54.54532 h -90.90885 a 27.272655,27.272655 0 0 1 -27.27266,-27.27266 z"
      />
      <path
        fill={`#${LEFT_STRIPE}`}
        d="M 172.72768,81.819216 H 8.5692711e-4 V 581.8179 c 0,30.12265 24.42266207289,54.54532 54.54531007289,54.54532 h 90.908853 a 27.272655,27.272655 0 0 0 27.27266,-27.27266 z"
      />
      <path
        fill="url(#gmail-b)"
        d="M 141.93685,20.255746 C 105.42331,-10.435083 50.946177,-5.7169131 20.255349,30.796627 -10.435479,67.305622 -5.7173098,121.78275 30.79623,152.47813 l 345.80818,290.6765 a 36.36354,36.36354 0 0 0 46.79533,0 L 769.20792,152.47358 C 805.71691,121.78275 810.43508,67.305622 779.74426,30.792081 749.05343,-5.7169131 694.5763,-10.435083 658.0673,20.255746 L 399.9998,237.18245 Z"
      />
    </svg>
  );
}
