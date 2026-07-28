import type { OrgUnitNode } from "@/lib/types/org-unit";

type OrgUnitTreeProps = {
  node: OrgUnitNode;
  depth?: number;
};

export function OrgUnitTree({ node, depth = 0 }: OrgUnitTreeProps) {
  return (
    <div className={depth > 0 ? "border-l border-slate-200 pl-4" : ""}>
      <div className="rounded-md border border-slate-200 bg-white px-3 py-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-medium text-ink">{node.name}</span>
          <span className="rounded-full bg-leaf/10 px-2 py-0.5 text-xs font-medium text-leaf">
            {node.unit_type}
          </span>
        </div>
      </div>

      {node.children.length > 0 ? (
        <div className="mt-3 space-y-3">
          {node.children.map((child) => (
            <OrgUnitTree key={child.id} node={child} depth={depth + 1} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
