const NODES = [
  { x: 40, y: 260, label: "Vault" },
  { x: 260, y: 120, label: "Embeddings" },
  { x: 480, y: 280, label: "pgvector" },
  { x: 700, y: 110, label: "Dashboard" },
] as const;

const EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
];

function edgePath(a: (typeof NODES)[number], b: (typeof NODES)[number]) {
  const midX = (a.x + b.x) / 2;
  return `M ${a.x} ${a.y} Q ${midX} ${a.y} ${midX} ${(a.y + b.y) / 2} T ${b.x} ${b.y}`;
}

export default function HeroGraph() {
  return (
    <svg
      viewBox="0 0 780 360"
      className="hidden lg:block absolute inset-y-0 right-0 h-full w-full max-w-[760px] text-foreground [mask-image:linear-gradient(to_left,black_35%,transparent_88%)]"
      aria-hidden
    >
      <defs>
        <filter id="glow" x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {EDGES.map(([a, b], i) => (
        <path
          key={`glow-${i}`}
          d={edgePath(NODES[a], NODES[b])}
          fill="none"
          stroke="oklch(0.65 0.18 280)"
          strokeOpacity={0.35}
          strokeWidth={3}
          filter="url(#glow)"
        />
      ))}

      {EDGES.map(([a, b], i) => (
        <path
          key={i}
          d={edgePath(NODES[a], NODES[b])}
          fill="none"
          stroke="currentColor"
          strokeOpacity={0.35}
          strokeWidth={1.5}
        />
      ))}
      {EDGES.map(([a, b], i) => (
        <path
          key={`flow-${i}`}
          d={edgePath(NODES[a], NODES[b])}
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="animate-flow-dash"
          style={{ animationDelay: `${i * 0.3}s` }}
        />
      ))}

      {NODES.map((node, i) => (
        <g key={i} filter="url(#glow)">
          <circle
            cx={node.x}
            cy={node.y}
            r={8}
            fill="oklch(0.65 0.18 280)"
            fillOpacity={0.3}
            className="animate-ping"
            style={{
              transformOrigin: `${node.x}px ${node.y}px`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: "2.4s",
            }}
          />
          <circle cx={node.x} cy={node.y} r={6} fill="currentColor" />
          <text
            x={node.x}
            y={node.y + 26}
            textAnchor="middle"
            className="fill-current text-[13px] font-medium"
            opacity={0.75}
          >
            {node.label}
          </text>
        </g>
      ))}
    </svg>
  );
}
