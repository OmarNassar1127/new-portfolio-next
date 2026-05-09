import Hero from '@/components/sections/Hero';
import TechMarquee from '@/components/sections/TechMarquee';
import BentoDashboard from '@/components/sections/BentoDashboard';
import ProjectsShowcase from '@/components/sections/ProjectsShowcase';
import About from '@/components/sections/About';
import Experience from '@/components/sections/Experience';
import Skills from '@/components/sections/Skills';
import Certifications from '@/components/sections/Certifications';
import Contact from '@/components/sections/Contact';

export default function HomePage() {
  return (
    <>
      <Hero />
      <TechMarquee />
      <BentoDashboard />
      <ProjectsShowcase />
      <About />
      <Experience />
      <Skills />
      <Certifications />
      <Contact />
    </>
  );
}
