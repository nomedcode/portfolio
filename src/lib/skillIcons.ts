import {
  siAnthropic,
  siBun,
  siCplusplus,
  siCss,
  siCursor,
  siDatadog,
  siDigitalocean,
  siDocker,
  siFirebase,
  siFigma,
  siFlutter,
  siFramer,
  siGooglecloud,
  siGreensock,
  siHtml5,
  siHuggingface,
  siJavascript,
  siJetpackcompose,
  siKotlin,
  siKubernetes,
  siLangflow,
  siLaravel,
  siMongodb,
  siMysql,
  siNewrelic,
  siNextdotjs,
  siNodedotjs,
  siNumpy,
  siOllama,
  siPandas,
  siPostgresql,
  siPython,
  siPytorch,
  siReact,
  siRedis,
  siScikitlearn,
  siSentry,
  siSupabase,
  siTailwindcss,
  siTensorflow,
  siTerraform,
  siTermius,
  siTypescript,
  siVercel,
  siVite,
  siGithubactions,
  siGithubcopilot,
  type SimpleIcon,
} from "simple-icons";

// A skill mark, drawn in one colour. Simple Icons marks sit on a 24 unit grid; a mark from elsewhere brings its own
// square view box (the glyph at about 84% of it, as the Simple Icons marks are) and, if the glyph has holes, an
// even-odd fill rule.
export type SkillIcon = Pick<SimpleIcon, "title" | "slug" | "hex" | "path"> & {
  viewBox?: string;
  fillRule?: "evenodd";
};

// Java: the cup from Font Awesome Free 6 (brand icon "java", CC BY 4.0, as shipped in react-icons/fa6). Simple Icons
// no longer carries a Java mark; 007396 is the blue it used before it dropped it.
const java: SkillIcon = {
  title: "Java",
  slug: "java",
  hex: "007396",
  viewBox: "-112.8 -48.8 609.5 609.5",
  path: "M277.74 312.9c9.8-6.7 23.4-12.5 23.4-12.5s-38.7 7-77.2 10.2c-47.1 3.9-97.7 4.7-123.1 1.3-60.1-8 33-30.1 33-30.1s-36.1-2.4-80.6 19c-52.5 25.4 130 37 224.5 12.1zm-85.4-32.1c-19-42.7-83.1-80.2 0-145.8C296 53.2 242.84 0 242.84 0c21.5 84.5-75.6 110.1-110.7 162.6-23.9 35.9 11.7 74.4 60.2 118.2zm114.6-176.2c.1 0-175.2 43.8-91.5 140.2 24.7 28.4-6.5 54-6.5 54s62.7-32.4 33.9-72.9c-26.9-37.8-47.5-56.6 64.1-121.3zm-6.1 270.5a12.19 12.19 0 0 1-2 2.6c128.3-33.7 81.1-118.9 19.8-97.3a17.33 17.33 0 0 0-8.2 6.3 70.45 70.45 0 0 1 11-3c31-6.5 75.5 41.5-20.6 91.4zM348 437.4s14.5 11.9-15.9 21.2c-57.9 17.5-240.8 22.8-291.6.7-18.3-7.9 16-19 26.8-21.3 11.2-2.4 17.7-2 17.7-2-20.3-14.3-131.3 28.1-56.4 40.2C232.84 509.4 401 461.3 348 437.4zM124.44 396c-78.7 22 47.9 67.4 148.1 24.5a185.89 185.89 0 0 1-28.2-13.8c-44.7 8.5-65.4 9.1-106 4.5-33.5-3.8-13.9-15.2-13.9-15.2zm179.8 97.2c-78.7 14.8-175.8 13.1-233.3 3.6 0-.1 11.8 9.7 72.4 13.6 92.2 5.9 233.8-3.3 237.1-46.9 0 0-6.4 16.5-76.2 29.7zM260.64 353c-59.2 11.4-93.5 11.1-136.8 6.6-33.5-3.5-11.6-19.7-11.6-19.7-86.8 28.8 48.2 61.4 169.5 25.9a60.37 60.37 0 0 1-21.1-12.8z",
};

// Kiro: the ghost and its two eyes from https://kiro.dev/icon.svg, without the purple tile. The eyes are holes, so the
// path is filled even-odd. 9046FF is the tile's purple.
const kiro: SkillIcon = {
  title: "Kiro",
  slug: "kiro",
  hex: "9046FF",
  viewBox: "125.7 126.2 947.6 947.6",
  fillRule: "evenodd",
  path: "M398.554 818.914C316.315 1001.03 491.477 1046.74 620.672 940.156C658.687 1059.66 801.052 970.473 852.234 877.795C964.787 673.567 919.318 465.357 907.64 422.374C827.637 129.443 427.623 128.946 358.8 423.865C342.651 475.544 342.402 534.18 333.458 595.051C328.986 625.86 325.507 645.488 313.83 677.785C306.873 696.424 297.68 712.819 282.773 740.645C259.915 783.881 269.604 867.113 387.87 823.883L399.051 818.914H398.554Z M636.123 549.353C603.328 549.353 598.359 510.097 598.359 486.742C598.359 465.623 602.086 448.977 609.293 438.293C615.504 428.852 624.697 424.131 636.123 424.131C647.555 424.131 657.492 428.852 664.447 438.541C672.398 449.474 676.623 466.12 676.623 486.742C676.623 525.998 661.471 549.353 636.375 549.353H636.123Z M771.24 549.353C738.445 549.353 733.477 510.097 733.477 486.742C733.477 465.623 737.203 448.977 744.41 438.293C750.621 428.852 759.814 424.131 771.24 424.131C782.672 424.131 792.609 428.852 799.564 438.541C807.516 449.474 811.74 466.12 811.74 486.742C811.74 525.998 796.588 549.353 771.492 549.353H771.24Z",
};


const icons: Record<string, SkillIcon> = {
  typescript: siTypescript,
  javascript: siJavascript,
  python: siPython,
  cplusplus: siCplusplus,
  react: siReact,
  nextdotjs: siNextdotjs,
  tailwindcss: siTailwindcss,
  framer: siFramer,
  greensock: siGreensock,
  kotlin: siKotlin,
  jetpackcompose: siJetpackcompose,
  flutter: siFlutter,
  nodedotjs: siNodedotjs,
  bun: siBun,
  postgresql: siPostgresql,
  mysql: siMysql,
  mongodb: siMongodb,
  redis: siRedis,
  supabase: siSupabase,
  firebase: siFirebase,
  tensorflow: siTensorflow,
  terraform: siTerraform,
  pytorch: siPytorch,
  huggingface: siHuggingface,
  ollama: siOllama,
  githubcopilot: siGithubcopilot,
  anthropic: siAnthropic,
  cursor: siCursor,
  figma: siFigma,
  googlecloud: siGooglecloud,
  docker: siDocker,
  kubernetes: siKubernetes,
  githubactions: siGithubactions,
  vercel: siVercel,
  langflow: siLangflow,
  laravel: siLaravel,
  html5: siHtml5,
  css: siCss,
  vite: siVite,
  scikitlearn: siScikitlearn,
  numpy: siNumpy,
  pandas: siPandas,
  digitalocean: siDigitalocean,
  sentry: siSentry,
  datadog: siDatadog,
  newrelic: siNewrelic,
  termius: siTermius,
  java,
  kiro,
};

export function getSkillIcon(slug: string): SkillIcon | undefined {
  return icons[slug];
}
