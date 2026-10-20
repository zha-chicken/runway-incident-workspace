import type {Metadata, Viewport} from 'next';
import './globals.css';
export const metadata:Metadata={
  title:'航衡 · AeroContext · Incident review',
  description:'A bilingual, evidence-based simulation for reviewing airline disruption incidents.'
};
export const viewport:Viewport={
  themeColor:[{media:'(prefers-color-scheme: light)',color:'#f4f4f5'},{media:'(prefers-color-scheme: dark)',color:'#09090b'}]
};
/** Applies a saved light/dark choice before first paint; without one the page follows the device. */
const themeScript=`(function(){try{var t=localStorage.getItem("runway-theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}})()`;
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en" suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:themeScript}}/></head><body>{children}</body></html>;
}
