import { Poppins } from 'next/font/google';
import Navbar from '@/components/Navbar';
import { Toaster } from 'react-hot-toast';
import './globals.css';
import Footer from '@/components/Footer';

// Load Poppins font with variable
const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-poppins',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={poppins.variable}>
      <body className="font-poppins bg-gray-100 text-gray-900">
        <Navbar />
        <main> {/* Added padding-top to account for navbar height */}
          {children}
        </main>
        <Toaster />
        <Footer />
      </body>
    </html>
  );
}