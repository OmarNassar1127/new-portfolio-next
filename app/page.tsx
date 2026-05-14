import Hero from '@/components/sections/Hero';
import ProjectsShowcase from '@/components/sections/ProjectsShowcase';
import About from '@/components/sections/About';
import Teaching from '@/components/sections/Teaching';
import Experience from '@/components/sections/Experience';
import Stack from '@/components/sections/Stack';
import Certifications from '@/components/sections/Certifications';
import OpenSource from '@/components/sections/OpenSource';
import Contact from '@/components/sections/Contact';

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProjectsShowcase />
      <About />
      <Teaching />
      <Experience />
      <Stack />
      <Certifications />
      <OpenSource />
      <Contact />
    </>
  );
}
