import type {Metadata} from 'next';
import './globals.css';
export const metadata:Metadata={
  title:'Runway · Incident workspace',
  description:'A bilingual, evidence-based simulation for reviewing airline disruption incidents.'
};
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en"><body>{children}</body></html>;
}
