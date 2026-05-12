import { SectionTitle } from "@/components/ui/section-title";
import { GeneratorForm } from "@/components/generator/generator-form";
import { PreviewTabs } from "@/components/generator/preview-tabs";

export default function GeneratorPage() {
  return (
    <div className="space-y-6">
      <div>
        <GeneratorForm /> 
      </div>
    </div>
  );
}
