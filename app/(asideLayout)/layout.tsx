import Header from "@/components/Layout/Header";
import Footer from "@/components/Layout/Footer";
import Aside from "@/components/Layout/Aside";

export default function AsideLayout({children}: {children: React.ReactNode}) {
  return (
    <>
      <Header />
      <main className="flex">
        <Aside />
        {children}
      </main>
      <Footer />
    </>
  );
}
