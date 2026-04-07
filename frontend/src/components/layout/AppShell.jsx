import Navbar from './Navbar';
import Footer from './Footer';

export default function AppShell({ children }) {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="pb-10">{children}</main>
      <Footer />
    </div>
  );
}
