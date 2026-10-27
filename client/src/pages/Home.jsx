import Hero from '../components/Hero';
import About from '../components/About';
import Skills from '../components/Skills';
import Projects from '../components/Projects';
import GitHubSection from '../components/GitHubSection';
import Stats from '../components/Stats';
import Experience from '../components/Experience';
import Services from '../components/Services';
import Testimonials from '../components/Testimonials';
import Contact from '../components/Contact';

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Skills />
      <Projects />
      <GitHubSection />
      <Stats />
      <Experience />
      <Services />
      <Testimonials />
      <Contact />
    </>
  );
}
