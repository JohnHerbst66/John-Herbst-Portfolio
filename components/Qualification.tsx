import Reveal from "./Reveal";
import {
  knowledgeModules,
  practicalModules,
  qualification,
  type Module,
} from "@/content/qualification";

function ModuleTable({
  heading,
  columns,
  modules,
}: {
  heading: string;
  columns: [string, string];
  modules: Module[];
}) {
  return (
    <div>
      <h3 className="font-mono text-xs tracking-wider text-muted mb-3">
        {heading}
      </h3>

      {/* Wide table scrolls inside its own box rather than the page. */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[520px] font-mono text-xs border-collapse">
          <thead>
            <tr className="text-muted border-b border-panelline">
              <th className="text-left font-normal py-2 pr-3">Module</th>
              <th className="text-right font-normal py-2 px-2 w-16">Cr</th>
              <th className="text-right font-normal py-2 px-2 w-20">NQF</th>
              <th className="text-right font-normal py-2 px-2 w-24">
                {columns[0]}
              </th>
              <th className="text-right font-normal py-2 px-2 w-24">
                {columns[1]}
              </th>
              <th className="text-right font-normal py-2 pl-2 w-20">Result</th>
            </tr>
          </thead>
          <tbody>
            {modules.map((m) => (
              <tr
                key={m.code}
                className="border-b border-panelline/60 last:border-0"
              >
                <td className="py-2 pr-3">
                  <span className="text-paper">{m.name}</span>
                  <span className="text-muted ml-2">{m.code}</span>
                  {m.note && (
                    <span className="block text-signal mt-0.5">{m.note}</span>
                  )}
                </td>
                <td className="text-right text-muted py-2 px-2">{m.credits}</td>
                <td className="text-right text-muted py-2 px-2">{m.nqf}</td>
                <td className="text-right text-paper py-2 px-2">
                  {m.marks[0]}%
                </td>
                <td className="text-right text-paper py-2 px-2">
                  {m.marks[1]}%
                </td>
                <td className="text-right py-2 pl-2">
                  <span
                    className={
                      m.outcome === "C" ? "text-blueprint" : "text-signal"
                    }
                  >
                    {m.outcome}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function Qualification() {
  const all = [...knowledgeModules, ...practicalModules];
  const passed = all.filter((m) => m.outcome === "C");
  const creditsEarned = passed.reduce((sum, m) => sum + m.credits, 0);

  return (
    <section
      id="qualification"
      className="px-6 md:px-12 py-16 max-w-6xl mx-auto"
    >
      <h2 className="font-mono text-sm tracking-wider text-blueprint mb-8">
        // QUALIFICATION
      </h2>

      <Reveal>
        <div className="spec-panel bg-panel border border-panelline rounded p-6 md:p-8">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1 mb-1">
            <h3 className="font-display font-bold text-xl text-paper">
              {qualification.title}
            </h3>
            {qualification.interim && (
              <span className="font-mono text-xs text-signal">IN PROGRESS</span>
            )}
          </div>
          <p className="font-mono text-xs text-muted mb-6">
            {qualification.institution} · NQF Level {qualification.nqf} · SAQA
            ID {qualification.saqaId} · {qualification.credits} credits
          </p>

          <div className="flex flex-wrap gap-6 mb-8 font-mono text-xs">
            <div>
              <span className="block text-2xl text-blueprint">
                {passed.length}/{all.length}
              </span>
              <span className="text-muted">modules competent</span>
            </div>
            <div>
              <span className="block text-2xl text-blueprint">
                {creditsEarned}
              </span>
              <span className="text-muted">credits earned</span>
            </div>
            <div>
              <span className="block text-2xl text-blueprint">
                {Math.max(...all.map((m) => Math.max(...m.marks)))}%
              </span>
              <span className="text-muted">highest mark</span>
            </div>
          </div>

          <div className="space-y-8">
            <ModuleTable
              heading="KNOWLEDGE MODULES"
              columns={["Summative A", "Summative B"]}
              modules={knowledgeModules}
            />
            <ModuleTable
              heading="PRACTICAL MODULES"
              columns={["Workbook", "Assessment"]}
              modules={practicalModules}
            />
          </div>

          <p className="font-mono text-[10px] text-muted mt-6">
            C = competent · NYC = not yet competent. Transcribed from the QCTO
            interim statement of results.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
