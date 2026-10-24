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
const lineStrong = "#c4baa5";

export function StudyScene({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 640 400"
      className={className}
      role="img"
      aria-label="Students studying educational lesson materials together"
      preserveAspectRatio="xMidYMid slice"
      focusable="false"
    >
      {/* Room */}
      <rect width="640" height="400" fill={cream} />
      <rect y="300" width="640" height="100" fill={sage} />
      <path d="M0 300h640" stroke={lineStrong} strokeWidth="2" />
      <g stroke={moss} strokeOpacity="0.85">
        <path d="M110 302 88 400M230 302 208 400M350 302 328 400M470 302 448 400M590 302 568 400" />
        <path d="M0 336h640M0 370h640" />
      </g>

      {/* Wall star */}
      <g transform="translate(66 52)" fill="none" stroke={gold} strokeWidth="2.5" strokeOpacity="0.45">
        <path d="M20 0 40 20 20 40 0 20Z" />
        <rect x="8" y="8" width="24" height="24" />
      </g>

      {/* Pinned lesson sheet */}
      <rect x="380" y="32" width="220" height="232" fill={paper} stroke={forest} strokeWidth="2" />
      <rect x="388" y="40" width="204" height="216" fill="none" stroke={gold} strokeOpacity="0.35" />
      <circle cx="490" cy="46" r="4" fill={gold} />
      <g stroke={forest} strokeOpacity="0.5" strokeWidth="2">
        <path d="M490 116v-24M490 116h-32M490 116h32M490 116v24" />
      </g>
      <g transform="translate(462 88)" fill="none" stroke={forest} strokeWidth="2.5">
        <path d="M28 0 56 28 28 56 0 28Z" />
        <rect x="12" y="12" width="32" height="32" />
      </g>
      <circle cx="490" cy="92" r="4" fill={brick} />
      <circle cx="458" cy="116" r="4" fill={gold} />
      <circle cx="522" cy="116" r="4" fill={gold} />
      <circle cx="490" cy="140" r="4" fill={brick} />
      <g fill={moss}>
        <rect x="404" y="168" width="172" height="8" />
        <rect x="404" y="186" width="150" height="8" />
        <rect x="404" y="204" width="164" height="8" />
        <rect x="404" y="222" width="118" height="8" />
        <rect x="404" y="240" width="142" height="8" />
      </g>
      <rect x="404" y="240" width="40" height="8" fill={goldLight} />

      {/* Seated students */}
      <circle cx="132" cy="208" r="15" fill={forestDeep} />
      <path d="M110 272v-24c0-16 10-26 22-26s22 10 22 26v24Z" fill={forest} />
      <path d="M116 250 100 266" stroke={forestDeep} strokeWidth="9" strokeLinecap="round" />

      <circle cx="230" cy="200" r="15" fill={forestDeep} />
      <path d="M208 272v-32c0-16 10-26 22-26s22 10 22 26v32Z" fill={forestLight} />
      <path d="M252 246 276 264" stroke={forest} strokeWidth="9" strokeLinecap="round" />

      {/* Standing teacher at the lesson sheet */}
      <circle cx="360" cy="168" r="14" fill={forestDeep} />
      <path d="M340 300v-84c0-16 9-28 20-28s20 12 20 28v84Z" fill={forest} />
      <path d="M378 198 398 178" stroke={forest} strokeWidth="9" strokeLinecap="round" />
      <circle cx="400" cy="176" r="5" fill={forestDeep} />
      <rect x="344" y="296" width="13" height="8" fill={forestDeep} />
      <rect x="363" y="296" width="13" height="8" fill={forestDeep} />

      {/* Desk */}
      <rect x="48" y="272" width="264" height="12" fill={cream} stroke={gold} strokeWidth="2" />
      <rect x="66" y="284" width="10" height="72" fill={forest} />
      <rect x="290" y="284" width="10" height="72" fill={forest} />

      {/* Books on the desk */}
      <rect x="60" y="264" width="52" height="8" fill={brick} />
      <rect x="66" y="256" width="46" height="8" fill={goldLight} />
      <rect x="62" y="248" width="50" height="8" fill={forestLight} />
      <path d="M262 272h52l6-14h-64Z" fill={paper} stroke={forest} strokeWidth="1.5" />
      <path d="M288 259v13" stroke={moss} strokeWidth="1.5" />
      <rect x="322" y="252" width="18" height="20" fill={sage} stroke={forest} strokeWidth="1.5" />
      <path d="M327 252v-8M332 252v-6M337 252v-9" stroke={brick} strokeWidth="2" strokeLinecap="round" />

      {/* Plant */}
      <g transform="translate(-18 0)">
        <path d="M596 306c-2-18-12-28-24-34 14-2 24 5 29 17 3-16 12-24 26-24-12 10-18 24-18 41Z" fill={forest} />
        <rect x="572" y="302" width="46" height="8" fill={forestDeep} />
        <path d="M575 310h40l-5 42h-30Z" fill={brick} />
        <path d="M575 310h40l-1 7h-38Z" fill="#8a2d23" />
      </g>
    </svg>
  );
}
