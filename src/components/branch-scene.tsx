const plaster = "#f3eee3";
const paper = "#fffdf7";
const cream = "#faf6ec";
const forest = "#1b3d2e";
const forestDeep = "#0e2118";
const forestLight = "#245040";
const gold = "#b0863c";
const goldLight = "#e4c58a";
const brick = "#a5382c";
const sage = "#e4e8dc";
const moss = "#cbd2c1";

const spineColors = [goldLight, brick, paper, sage, gold, forestLight, cream];

function layoutSpines(widths: number[]) {
  const gap = 3;
  let x = 52;
  return widths.map((w) => {
    const spine = { x, w };
    x += w + gap;
    return spine;
  });
}

const shelfRows = [
  { base: 150, widths: [12, 9, 15, 11, 14, 8, 13, 10, 16, 11, 14, 9, 12] },
  { base: 212, widths: [13, 10, 15, 9, 12, 14, 8, 11, 16, 12, 10, 14] },
  { base: 274, widths: [11, 14, 9, 13, 10, 15, 8, 12, 16, 10, 13] },
].map((row, rowIndex) => ({
  ...row,
  spines: layoutSpines(row.widths).map((spine, i) => ({
    ...spine,
    h: 30 + ((i * 7 + rowIndex * 5) % 11),
  })),
}));

function Arch({
  x,
  width,
  spring,
  base,
  radius,
}: {
  x: number;
  width: number;
  spring: number;
  base: number;
  radius: number;
}) {
  const center = x + width / 2;
  return (
    <g>
      <path
        d={`M${x} ${base}V${spring}A${radius} ${radius} 0 0 1 ${x + width} ${spring}V${base}Z`}
        fill={paper}
      />
      <path
        d={`M${center} ${spring - radius}V${base}M${x} ${spring}H${x + width}`}
        stroke={gold}
        strokeWidth="2"
        strokeOpacity="0.45"
      />
      <path
        d={`M${x + width / 3} ${spring}V${base}M${x + (2 * width) / 3} ${spring}V${base}`}
        stroke={gold}
        strokeWidth="2"
        strokeOpacity="0.22"
      />
      <path
        d={`M${center} ${spring - radius + 2}L${center + 11} ${spring - 14}L${center} ${
          spring - 2
        }L${center - 11} ${spring - 14}Z`}
        fill="none"
        stroke={gold}
        strokeWidth="2"
        strokeOpacity="0.35"
      />
    </g>
  );
}

export function BranchScene({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 640 440"
      className={className}
      role="img"
      aria-label="Students and teachers in a modern DashLib branch reading area"
      preserveAspectRatio="xMidYMid slice"
      focusable="false"
    >
      {/* Room */}
      <rect width="640" height="440" fill={plaster} />
      <rect y="336" width="640" height="104" fill={sage} />
      <path d="M0 336h640" stroke={moss} strokeWidth="2" />
      <path d="M352 336h268l-64 104H276Z" fill={goldLight} fillOpacity="0.22" />
      <g stroke={moss} strokeOpacity="0.85">
        <path d="M120 338 96 440M240 338 216 440M360 338 336 440M480 338 456 440M600 338 576 440" />
        <path d="M0 370h640M0 404h640" />
      </g>

      {/* Wall motif */}
      <g transform="translate(274 38)" fill="none" stroke={gold} strokeWidth="2.5" strokeOpacity="0.5">
        <path d="M22 0 44 22 22 44 0 22Z" />
        <rect x="9" y="9" width="26" height="26" />
      </g>

      {/* Shelving */}
      <rect x="36" y="84" width="216" height="232" fill={forest} />
      <rect x="44" y="92" width="200" height="208" fill={forestDeep} />
      {shelfRows.map((row) => (
        <g key={row.base}>
          {row.spines.map((spine, i) => (
            <rect
              key={`${row.base}-${spine.x}`}
              x={spine.x}
              y={row.base - spine.h}
              width={spine.w}
              height={spine.h}
              fill={spineColors[i % spineColors.length]}
            />
          ))}
          <rect x="36" y={row.base} width="216" height="6" fill={paper} />
        </g>
      ))}
      <rect x="36" y="306" width="216" height="10" fill={forestLight} />
      <rect x="218" y="267" width="34" height="7" fill={brick} />
      <rect x="222" y="260" width="30" height="7" fill={paper} />
      <rect x="219" y="253" width="32" height="7" fill={goldLight} />

      {/* Arched window */}
      <rect x="340" y="28" width="280" height="280" fill={forest} />
      <rect x="344" y="32" width="272" height="272" fill="none" stroke={goldLight} strokeOpacity="0.22" />
      <Arch x={376} width={56} spring={150} base={292} radius={28} />
      <Arch x={452} width={56} spring={150} base={292} radius={28} />
      <Arch x={528} width={56} spring={150} base={292} radius={28} />
      <rect x="352" y="292" width="256" height="4" fill={gold} />

      {/* Standing reader */}
      <path d="M282 240 260 254" stroke={forestDeep} strokeWidth="9" strokeLinecap="round" />
      <path d="M280 232h32l5 62h-42Z" fill={forest} />
      <rect x="291" y="224" width="10" height="12" fill={forestDeep} />
      <circle cx="296" cy="212" r="14" fill={forestDeep} />
      <rect x="289" y="290" width="11" height="42" fill={forestDeep} />
      <rect x="303" y="290" width="11" height="42" fill={forestDeep} />
      <rect x="284" y="330" width="18" height="7" fill={forestDeep} />
      <rect x="301" y="330" width="18" height="7" fill={forestDeep} />

      {/* Reading plant */}
      <g transform="translate(-14 0)">
        <path d="M586 344c-2-24-14-38-30-46 18-2 30 6 36 22 4-20 16-30 34-30-16 12-24 30-24 54Z" fill={forest} />
        <path d="M572 344c-8-14-8-26-2-38-10 10-14 24-10 38Z" fill={forestLight} />
        <rect x="556" y="340" width="60" height="10" fill={forestDeep} />
        <path d="M560 350h52l-6 54h-40Z" fill={brick} />
        <path d="M560 350h52l-1 9h-50Z" fill="#8a2d23" />
      </g>
    </svg>
  );
}
