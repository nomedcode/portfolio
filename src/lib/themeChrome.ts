// The browser chrome (a phone's address bar, a PWA title bar) follows the theme that is on the page. A
// media-query pair only follows the OS, so a manual toggle used to leave the bar on the wrong surface.
export const THEME_COLOR = { light: "#ffffff", dark: "#121212" } as const;

/** Repaints the theme-color meta tag from the root element's current theme class. */
export function applyThemeColor(root: HTMLElement): void {
  const content = root.classList.contains("dark") ? THEME_COLOR.dark : THEME_COLOR.light;
  let tag = document.head.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (!tag) {
    tag = document.createElement("meta");
    tag.name = "theme-color";
    document.head.appendChild(tag);
  }
  tag.content = content;
}

// Runs before paint, right after themeInitScript has put the theme class on <html>.
export const themeColorScript = `try{var m=document.querySelector('meta[name="theme-color"]');if(!m){m=document.createElement("meta");m.name="theme-color";document.head.appendChild(m)}m.content=document.documentElement.classList.contains("dark")?"${THEME_COLOR.dark}":"${THEME_COLOR.light}"}catch(e){}`;
