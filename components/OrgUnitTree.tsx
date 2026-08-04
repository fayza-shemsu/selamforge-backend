import type { OrgUnitNode } from "@/lib/types/org-unit";

type OrgUnitTreeProps = {
  node: OrgUnitNode;
  depth?: number;
};

function countNodes(node: OrgUnitNode): number {
  return 1 + node.children.reduce((total, child) => total + countNodes(child), 0);
}

export function OrgUnitTree({ node, depth = 0 }: OrgUnitTreeProps) {
  const nodeCount = countNodes(node);

  return (
    <div className={depth > 0 ? "border-l border-slate-200 pl-4" : ""}>
      <div className="rounded-md border border-slate-200 bg-white px-3 py-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <span className="font-medium text-ink">{node.name}</span>
            <span className="ml-2 rounded-full bg-leaf/10 px-2 py-0.5 text-xs font-medium text-leaf">
              {node.unit_type}
            </span>
          </div>
          <span className="text-xs text-slate-500">{nodeCount} nodes</span>
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
