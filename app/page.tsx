import Nav from "@/components/Nav";
import ScrollConstruct from "@/components/ScrollConstruct";
import Hero from "@/components/Hero";
import TechStack from "@/components/TechStack";
import FeaturedProjects from "@/components/FeaturedProjects";
import Qualification from "@/components/Qualification";
import LiveActivity from "@/components/LiveActivity";
import Footer from "@/components/Footer";
import { getRecentRepos } from "@/lib/github";

export default async function Home() {
  const repos = await getRecentRepos(6);
  const latest = repos.length > 0 ? repos[0] : null;

  return (
    <main>
      <ScrollConstruct />
      <Nav />
      <Hero latest={latest} />
      <TechStack />
      <FeaturedProjects />
      <Qualification />
      <LiveActivity repos={repos} />
      <Footer />
    </main>
  );
}
