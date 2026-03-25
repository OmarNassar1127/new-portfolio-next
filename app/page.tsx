import Hero from '@/components/sections/Hero';
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
