import type {Metadata, Viewport} from 'next';
import './globals.css';
export const metadata:Metadata={
  title:'航衡 · AeroContext · Incident review',
  description:'A bilingual, evidence-based simulation for reviewing airline disruption incidents.'
};
export const viewport:Viewport={
  themeColor:[{media:'(prefers-color-scheme: light)',color:'#f4f4f5'},{media:'(prefers-color-scheme: dark)',color:'#0a0a0a'}]
};
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en"><body>{children}</body></html>;
}
