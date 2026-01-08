import APlusBrandStory from "./APlusBrandStory";
import APlusComparisonChart from "./APlusComparisonChart";
import APlusFeatureGrid from "./APlusFeatureGrid";
import APlusHero from "./APlusHero";
import APlusImageText from "./APlusImageText";
import APlusVideo from "./APlusVideo";

// biome-ignore lint/suspicious/noExplicitAny: Strapi dynamic zone data
type APlusModule = any;

interface APlusSectionProps {
	modules?: APlusModule[];
	strapiUrl?: string;
}

const componentMap: Record<
	string,
	React.FC<{ data: APlusModule; strapiUrl: string }>
> = {
	"aplus.a-plus-hero": APlusHero,
	"aplus.a-plus-feature-grid": APlusFeatureGrid,
	"aplus.a-plus-comparison-chart": APlusComparisonChart,
	"aplus.a-plus-image-text": APlusImageText,
	"aplus.a-plus-video": APlusVideo,
	"aplus.a-plus-brand-story": APlusBrandStory,
};

const APlusSection: React.FC<APlusSectionProps> = ({
	modules,
	strapiUrl = "",
}) => {
	if (!modules || modules.length === 0) {
		return null;
	}

	return (
		<section className="mt-16 border-t border-gray-200 pt-12">
			<h2 className="text-2xl font-bold text-primary mb-8 text-center">
				From the Brand
			</h2>
			<div className="space-y-12">
				{modules.map((module: APlusModule, index: number) => {
					const Component = componentMap[module.__component];
					if (!Component) {
						console.warn(`Unknown A+ component type: ${module.__component}`);
						return null;
					}
					return (
						<div key={module.id || index}>
							<Component data={module} strapiUrl={strapiUrl} />
						</div>
					);
				})}
			</div>
		</section>
	);
};

export default APlusSection;
