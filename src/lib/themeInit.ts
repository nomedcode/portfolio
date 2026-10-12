// Runs before paint. Stored choice wins; otherwise follow the OS scheme.
export const themeInitScript =
  'try{var t=localStorage.getItem("theme");if(t==="dark"||(t!=="light"&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}';
