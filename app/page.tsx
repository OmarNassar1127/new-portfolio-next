import Hero from '@/components/sections/Hero';
import Capabilities from '@/components/sections/Capabilities';
import Work from '@/components/sections/Work';
import About from '@/components/sections/About';
import Teaching from '@/components/sections/Teaching';
import Journey from '@/components/sections/Journey';
import Stack from '@/components/sections/Stack';
import Credentials from '@/components/sections/Credentials';
import Tools from '@/components/sections/Tools';
import Contact from '@/components/sections/Contact';

export default function HomePage() {
  return (
    <>
      <Hero />
      <Capabilities />
      <Work />
      <About />
      <Teaching />
      <Journey />
      <Stack />
      <Credentials />
      <Tools />
      <Contact />
    </>
  );
}
