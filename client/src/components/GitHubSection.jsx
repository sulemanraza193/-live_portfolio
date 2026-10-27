import Reveal from './Reveal';
import SectionHeading from './SectionHeading';
import GitHubStats from './GitHubStats';
import ContributionHeatmap from './ContributionHeatmap';
import PinnedRepos from './PinnedRepos';
import RecentActivity from './RecentActivity';
import CodingProfiles from './CodingProfiles';

export default function GitHubSection() {
  return (
    <section id="github" className="py-28 px-6 bg-card/30">
      <div className="max-w-6xl mx-auto">
        <SectionHeading
          eyebrow="GitHub"
          title="What I've been building"
          description="Live from GitHub — repos, activity, and contribution history."
        />

        <div className="grid lg:grid-cols-[1fr_1fr] gap-6 mb-6">
          <GitHubStats />
          <RecentActivity />
        </div>

        <div className="mb-10">
          <ContributionHeatmap />
        </div>

        <div className="mb-16">
          <PinnedRepos />
        </div>

        <Reveal className="text-center mb-8">
          <h3 className="font-display font-semibold text-lg">Coding Profiles</h3>
        </Reveal>
        <CodingProfiles />
      </div>
    </section>
  );
}
