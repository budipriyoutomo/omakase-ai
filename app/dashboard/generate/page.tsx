import { SectionTitle } from "@/components/ui/section-title";
import { GeneratorForm } from "@/components/generator/generator-form";
import { PreviewTabs } from "@/components/generator/preview-tabs";

export default function GeneratorPage() {
  return (
    <div className="space-y-6">
      <SectionTitle title="AI Generator" subtitle="Create campaign assets in seconds." />
      <div className="grid gap-5 xl:grid-cols-2">
        <GeneratorForm />
        <PreviewTabs />
      </div>
    </div>
  );
}
