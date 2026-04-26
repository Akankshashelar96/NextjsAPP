import { Header, Footer, GlobalBackground } from '@/components/layout';
import {
  Hero,
  Services,
  Portfolio,
  About,
  Contact
} from '@/components/sections';

export default function Home() {
  return (
    <>
      <GlobalBackground />
      <Header />
      <main>
        <Hero />
        <Services />
        <Portfolio />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
