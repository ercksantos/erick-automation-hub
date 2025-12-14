import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Problems } from "@/components/Problems";
import { Projects } from "@/components/Projects";
import { Process } from "@/components/Process";
import { Testimonials } from "@/components/Testimonials";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { UrgencyBar } from "@/components/UrgencyBar";

const Index = () => {
  return (
    <div className="min-h-screen">
      <UrgencyBar />
      <Header />
      <Hero />
      <About />
      <Problems />
      <Projects />
      <Process />
      <Testimonials />
      <Contact />
      <Footer />
    </div>
  );
};

export default Index;
