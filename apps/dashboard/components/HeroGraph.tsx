const NODES = [
  { x: 60, y: 150, label: "Vault" },
  { x: 290, y: 70, label: "Embeddings" },
  { x: 520, y: 150, label: "pgvector" },
  { x: 750, y: 70, label: "Dashboard" },
] as const;

const EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
];

export default function HeroGraph() {
  return (
    <svg
      viewBox="0 0 820 220"
      className="absolute inset-y-0 right-0 h-full w-[640px] max-w-[70%] text-foreground/70 [mask-image:linear-gradient(to_left,black_45%,transparent_90%)]"
      aria-hidden
    >
      {EDGES.map(([a, b], i) => {
        const from = NODES[a];
        const to = NODES[b];
        const midX = (from.x + to.x) / 2;
        return (
          <path
            key={i}
            d={`M ${from.x} ${from.y} Q ${midX} ${from.y} ${midX} ${(from.y + to.y) / 2} T ${to.x} ${to.y}`}
            fill="none"
            stroke="currentColor"
            strokeOpacity={0.3}
            strokeWidth={1.5}
          />
        );
      })}
      {EDGES.map(([a, b], i) => {
        const from = NODES[a];
        const to = NODES[b];
        const midX = (from.x + to.x) / 2;
        return (
          <path
            key={`flow-${i}`}
            d={`M ${from.x} ${from.y} Q ${midX} ${from.y} ${midX} ${(from.y + to.y) / 2} T ${to.x} ${to.y}`}
            fill="none"
            stroke="currentColor"
            strokeWidth={1.5}
            className="animate-flow-dash"
            style={{ animationDelay: `${i * 0.3}s` }}
          />
        );
      })}

      {NODES.map((node, i) => (
        <g key={i}>
          <circle
            cx={node.x}
            cy={node.y}
            r={5}
            fill="currentColor"
            fillOpacity={0.15}
            className="animate-ping"
            style={{ transformOrigin: `${node.x}px ${node.y}px`, animationDelay: `${i * 0.4}s`, animationDuration: "2.4s" }}
          />
          <circle cx={node.x} cy={node.y} r={4} fill="currentColor" />
          <text
            x={node.x}
            y={node.y + 20}
            textAnchor="middle"
            className="fill-current text-[11px] font-medium"
            opacity={0.65}
          >
            {node.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
