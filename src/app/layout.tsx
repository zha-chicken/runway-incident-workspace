import type {Metadata, Viewport} from 'next';
import './globals.css';
export const metadata:Metadata={
  title:'Runway · Incident workspace',
  description:'A bilingual, evidence-based simulation for reviewing airline disruption incidents.'
};
export const viewport:Viewport={
  themeColor:[{media:'(prefers-color-scheme: light)',color:'#f3f2ee'},{media:'(prefers-color-scheme: dark)',color:'#0d1117'}]
};
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en"><body>{children}</body></html>;
}
