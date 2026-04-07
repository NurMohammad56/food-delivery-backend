import Navbar from './Navbar';
import Footer from './Footer';

export default function AppShell({ children }) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
