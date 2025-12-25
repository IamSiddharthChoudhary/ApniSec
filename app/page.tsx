import Features from "@/componenrs/features";
import Footer from "@/componenrs/footer";
import Hero from "@/componenrs/hero";
import LiveIssues from "@/componenrs/live";
import Services from "@/componenrs/services";

export default function Home() {
  return (
    <>
      <Hero />
      <Features />
      <LiveIssues />
      <Services />
      <Footer />
    </>
  );
}
