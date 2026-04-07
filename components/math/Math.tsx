"use client";

import { InlineMath, BlockMath } from "react-katex";

export function M({ children }: { children: string }) {
  return <InlineMath math={children} />;
}

export function MD({ children }: { children: string }) {
  return (
    <div className="my-3 overflow-x-auto">
      <BlockMath math={children} />
    </div>
  );
}
