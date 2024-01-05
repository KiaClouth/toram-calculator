import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";

export default function FullLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  );
}
