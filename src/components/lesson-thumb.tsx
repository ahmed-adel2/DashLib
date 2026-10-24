const cream = "#f7f0e0";
const paper = "#fffdf7";
const forest = "#1b3d2e";
const gold = "#b0863c";
const goldLight = "#e4c58a";
const brick = "#a5382c";

function Tile({
  x,
  y,
  size,
  fill,
  stroke,
}: {
  x: number;
  y: number;
  size: number;
  fill: string;
  stroke: string;
}) {
  const h = size / 2;
  return (
    <g transform={`translate(${x - h} ${y - h})`}>
      <path d={`M0 ${h} L${h} 0 L${size} ${h} L${h} ${size}Z`} fill={fill} stroke={stroke} />
      <path
        d={`M${h * 0.45} 0 L${size - h * 0.45} 0 L${size} ${h * 0.45} L${size} ${size - h * 0.45} L${
          size - h * 0.45
        } ${size} L${h * 0.45} ${size} L0 ${size - h * 0.45} L0 ${h * 0.45}Z`}
        fill="none"
        stroke={stroke}
        strokeOpacity="0.45"
      />
    </g>
  );
}

export function LessonThumb({
  tone = 0,
  className = "",
}: {
  tone?: 0 | 1 | 2;
  className?: string;
}) {
  const accents = [gold, goldLight, brick];
  const accent = accents[tone] ?? gold;

  return (
    <svg viewBox="0 0 480 180" className={className} aria-hidden="true" focusable="false" preserveAspectRatio="xMidYMid slice">
      <rect width="480" height="180" fill={cream} />
      <rect x="0" y="0" width="480" height="6" fill={forest} />
      <g stroke={forest} strokeOpacity="0.12">
        <path d="M40 0v180M200 0v180M360 0v180" />
      </g>
      <Tile x={80} y={90} size={104} fill={paper} stroke={forest} />
      <Tile x={188} y={90} size={104} fill={accent} stroke={forest} />
      <Tile x={296} y={90} size={104} fill={paper} stroke={forest} />
      <Tile x={404} y={90} size={104} fill={forest} stroke={forest} />
      <rect x="0" y="174" width="480" height="6" fill={accent} />
    </svg>
  );
}
