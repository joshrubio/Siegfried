const NODES = [
  { x: 40, y: 260, label: "Vault", code: "ID:4F2A09" },
  { x: 260, y: 120, label: "Embeddings", code: "32.71°N" },
  { x: 480, y: 280, label: "pgvector", code: "ID:9C3E7B" },
  { x: 700, y: 110, label: "Dashboard", code: "117.16°W" },
] as const;

const EDGES: [number, number][] = [
  [0, 1],
  [1, 2],
  [2, 3],
];

const RETICLE_SIZE = 15;
const RETICLE_CORNER = 5;

function edgePath(a: (typeof NODES)[number], b: (typeof NODES)[number]) {
  const midX = (a.x + b.x) / 2;
  return `M ${a.x} ${a.y} Q ${midX} ${a.y} ${midX} ${(a.y + b.y) / 2} T ${b.x} ${b.y}`;
}

// Four corner-bracket strokes (lock-on / autofocus reticle) around a node.
function reticleCorners(x: number, y: number) {
  const s = RETICLE_SIZE;
  const c = RETICLE_CORNER;
  return [
    `M ${x - s} ${y - s + c} L ${x - s} ${y - s} L ${x - s + c} ${y - s}`, // top-left
    `M ${x + s - c} ${y - s} L ${x + s} ${y - s} L ${x + s} ${y - s + c}`, // top-right
    `M ${x - s} ${y + s - c} L ${x - s} ${y + s} L ${x - s + c} ${y + s}`, // bottom-left
    `M ${x + s - c} ${y + s} L ${x + s} ${y + s} L ${x + s} ${y + s - c}`, // bottom-right
  ];
}

// Horizontal scan-lines spanning (and a bit beyond, for seamless looping) the viewBox.
const SCAN_LINE_SPACING = 9;
const SCAN_LINE_COUNT = Math.ceil((360 + SCAN_LINE_SPACING * 2) / SCAN_LINE_SPACING);
const SCAN_LINES = Array.from({ length: SCAN_LINE_COUNT }, (_, i) => -SCAN_LINE_SPACING + i * SCAN_LINE_SPACING);

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
        <g key={i}>
          <circle cx={node.x} cy={node.y} r={6} fill="currentColor" filter="url(#glow)" />
          <text
            x={node.x}
            y={node.y + 26}
            textAnchor="middle"
            className="fill-current text-[13px] font-medium"
            opacity={0.75}
          >
            {node.label}
          </text>

          {/* God's-Eye-style lock-on reticle: corner brackets pulsing on each node */}
          <g
            className="animate-reticle-pulse"
            style={{
              transformOrigin: `${node.x}px ${node.y}px`,
              animationDelay: `${i * 0.35}s`,
            }}
            filter="url(#glow)"
          >
            {reticleCorners(node.x, node.y).map((d, ci) => (
              <path
                key={ci}
                d={d}
                fill="none"
                stroke="oklch(0.65 0.18 280)"
                strokeWidth={1.25}
                strokeLinecap="round"
                strokeOpacity={0.7}
              />
            ))}
          </g>

          {/* Simulated tracking ID / coordinate readout, flickering independently */}
          <text
            x={node.x + RETICLE_SIZE + 4}
            y={node.y - RETICLE_SIZE + 3}
            className="font-mono animate-label-flicker"
            style={{ fontSize: "7.5px", animationDelay: `${i * 0.55 + 0.15}s` }}
            fill="currentColor"
            fillOpacity={0.55}
          >
            {node.code}
          </text>
        </g>
      ))}

      {/* Subtle tactical scan-lines drifting across the whole graph */}
      <g className="animate-scan-lines" opacity={0.5}>
        {SCAN_LINES.map((y, i) => (
          <line key={i} x1={0} y1={y} x2={780} y2={y} stroke="currentColor" strokeWidth={1} strokeOpacity={0.05} />
        ))}
      </g>
    </svg>
  );
}
