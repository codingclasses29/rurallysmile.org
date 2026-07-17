import { PageHeader } from "@/components/common/PageHeader";

export function ModulePlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div>
      <PageHeader title={title} description={description} />
      <div className="container-page section-pad">
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
          This module UI will be connected in the next phase.
        </div>
      </div>
    </div>
  );
}
