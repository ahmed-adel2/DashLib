import type { CategoryId } from "@/lib/data";

const cream = "#fffdf7";
const paper = "#faf6ec";
const forest = "#1b3d2e";
const forestDeep = "#0e2118";
const forestLight = "#245040";
const gold = "#b0863c";
const goldLight = "#e4c58a";
const brick = "#a5382c";
const sage = "#e4e8dc";
const creamGround = "#f7f0e0";
const brickGround = "#f6dfdb";

function Star({
  x,
  y,
  size,
  fill,
}: {
  x: number;
  y: number;
  size: number;
  fill: string;
}) {
  const half = size / 2;
  return (
    <g transform={`translate(${x - half} ${y - half})`} fill={fill}>
      <path d={`M${half} 0 ${size} ${half} ${half} ${size} 0 ${half}Z`} />
      <path d={`M${size * 0.23} ${size * 0.23} H${size * 0.77} V${size * 0.77} H${size * 0.23}Z`} />
    </g>
  );
}

export function ProductArt({
  category,
  tone = 0,
  className = "",
}: {
  category: CategoryId;
  tone?: 0 | 1 | 2;
  className?: string;
}) {
  const accents = [goldLight, brick, cream];
  const accent = accents[tone] ?? goldLight;

  return (
    <svg
      viewBox="0 0 400 300"
      className={className}
      aria-hidden="true"
      focusable="false"
      preserveAspectRatio="xMidYMid slice"
    >
      {category === "books" ? (
        <g>
          <rect width="400" height="300" fill={forest} />
          <rect x="16" y="16" width="368" height="268" fill="none" stroke={goldLight} strokeOpacity="0.3" />
          <Star x={200} y={54} size={30} fill={accent} />
          <rect x="88" y="196" width="224" height="32" fill={cream} />
          <rect x="88" y="196" width="10" height="32" fill={gold} />
          <rect x="104" y="162" width="208" height="32" fill={goldLight} />
          <rect x="104" y="162" width="10" height="32" fill={forestDeep} />
          <rect x="88" y="128" width="216" height="32" fill={accent} />
          <rect x="88" y="128" width="10" height="32" fill={forestDeep} />
          <rect x="112" y="96" width="176" height="30" fill={cream} />
          <path d="M132 96v30" stroke={forest} strokeOpacity="0.35" />
          <path d="M150 111h118" stroke={forest} strokeOpacity="0.25" />
        </g>
      ) : null}

      {category === "stationery" ? (
        <g>
          <rect width="400" height="300" fill={creamGround} />
          {[46, 82, 118, 154, 190, 226, 262].map((y) => (
            <path key={y} d={`M28 ${y}h344`} stroke="#d8d0bd" strokeWidth="1" />
          ))}
          <path d="M64 30v240" stroke={brick} strokeOpacity="0.35" />
          <Star x={330} y={62} size={26} fill={gold} />
          <g transform="rotate(-26 200 160)">
            <path d="M66 143h220v34H66z" fill={forest} />
            <path d="M86 143h4v34h-4zM106 143h4v34h-4z" fill={forestLight} />
            <path d="M286 143h16v34h-16z" fill={goldLight} />
            <path d="M302 143h20v34h-20z" fill={brick} />
            <path d="M66 143 36 160l30 17z" fill={goldLight} />
            <path d="M44 156 36 160l8 4z" fill={forestDeep} />
          </g>
          <path d="M40 262h320" stroke={forest} strokeOpacity="0.2" />
        </g>
      ) : null}

      {category === "art" ? (
        <g>
          <rect width="400" height="300" fill={brickGround} />
          <circle cx="150" cy="116" r="56" fill={brick} fillOpacity="0.9" />
          <circle cx="232" cy="120" r="56" fill={gold} fillOpacity="0.9" />
          <circle cx="190" cy="184" r="56" fill={forest} fillOpacity="0.92" />
          <g transform="rotate(34 300 210)">
            <path d="M214 200h112v16H214z" fill={goldLight} />
            <path d="M326 200h20v16h-20z" fill={cream} />
            <path d="M346 200h22v16h-22z" fill={brick} />
            <path d="M214 200 178 208l36 8z" fill={forestDeep} />
          </g>
          <Star x={70} y={252} size={22} fill={cream} />
          <rect x="352" y="32" width="16" height="16" fill="none" stroke={forest} strokeOpacity="0.4" />
        </g>
      ) : null}

      {category === "bags" ? (
        <g>
          <rect width="400" height="300" fill={sage} />
          <path d="M158 112c0-44 84-44 84 0" fill="none" stroke={forestDeep} strokeWidth="11" />
          <path d="M124 128c0-32 152-32 152 0v124H124z" fill={forest} />
          <path d="M124 128c0-30 152-30 152 0v10H124z" fill={forestDeep} />
          <path d="M124 148h152" stroke={gold} strokeOpacity="0.5" />
          <rect x="150" y="178" width="100" height="58" fill={forestLight} />
          <path d="M150 178h100" stroke={goldLight} strokeOpacity="0.35" />
          <Star x={200} y={132} size={22} fill={goldLight} />
          <path d="M64 240h56M280 240h56" stroke={forest} strokeOpacity="0.2" />
        </g>
      ) : null}

      {category === "prints" ? (
        <g>
          <rect width="400" height="300" fill={creamGround} />
          <rect x="36" y="26" width="328" height="248" fill={paper} stroke={forest} strokeWidth="2" />
          <rect x="48" y="38" width="304" height="224" fill="none" stroke={gold} strokeOpacity="0.4" />
          <path d="M120 100h160M120 200h160M120 100v100M280 100v100" stroke={forest} strokeOpacity="0.15" />
          <Star x={120} y={100} size={40} fill={forest} />
          <Star x={280} y={100} size={40} fill={gold} />
          <Star x={120} y={200} size={40} fill={accent} />
          <Star x={280} y={200} size={40} fill={forest} />
          <path d="M200 60v180" stroke={brick} strokeOpacity="0.25" strokeDasharray="4 6" />
        </g>
      ) : null}
    </svg>
  );
}
