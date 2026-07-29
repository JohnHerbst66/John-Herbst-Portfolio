import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import FeaturedProjects from "@/components/FeaturedProjects";
import LiveActivity from "@/components/LiveActivity";
import Footer from "@/components/Footer";
import { getRecentRepos } from "@/lib/github";

export default async function Home() {
  const repos = await getRecentRepos(6);
  const latest = repos.length > 0 ? repos[0] : null;

  return (
    <main>
      <Nav />
      <Hero latest={latest} />
      <FeaturedProjects />
      <LiveActivity repos={repos} />
      <Footer />
    </main>
  );
}
