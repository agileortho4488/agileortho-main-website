// Art direction for device pages: hero tilt and line drawings. Design assets, not device facts.

/** Hero tilt in degrees for a cut-out photo: [desktop, phone]. Default: upright. */
export const tilt: Record<string, [number, number]> = {
  'distal-radius-locking-plate': [-32, -14],
};

/** Plate heads for the distal radius drawing: x centre, half width, head holes. */
const heads: [number, number, number, string][] = [
  [70, 35, 3, 'Narrow'],
  [200, 46, 4, 'Standard'],
  [330, 57, 5, 'Wide'],
];

function PlateHeads() {
  return (
    <svg viewBox="0 0 400 330" role="img" aria-labelledby="hw-t">
      <title id="hw-t">Line drawing of three plate heads: narrow, standard and wide</title>
      <g fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round">
        {heads.map(([cx, w, n]) => {
          const step = (2 * w - 28) / (n - 1);
          return (
            <g key={cx}>
              <path d={`M${cx - w},40 Q${cx},22 ${cx + w},40 L${cx + w - 6},78 Q${cx + 17},96 ${cx + 13},120 L${cx + 13},262 Q${cx},276 ${cx - 13},262 L${cx - 13},120 Q${cx - 17},96 ${cx - w + 6},78 Z`} />
              {Array.from({ length: n }, (_, i) => <circle key={`a${i}`} cx={cx - w + 14 + i * step} cy={52} r={4.5} />)}
              {Array.from({ length: n - 1 }, (_, i) => <circle key={`b${i}`} cx={cx - w + 14 + step / 2 + i * step} cy={68} r={4} />)}
              {[150, 190, 230].map(y => <circle key={y} cx={cx} cy={y} r={5} />)}
            </g>
          );
        })}
      </g>
      <g fill="currentColor" fontFamily="Inter, sans-serif" fontSize="20" textAnchor="middle">
        {heads.map(([cx, , , label]) => <text key={label} x={cx} y={306}>{label}</text>)}
      </g>
    </svg>
  );
}

/** Line drawing shown beside "What is ...?", with its caption. */
export const drawings: Record<string, { art: () => React.ReactElement; caption: string }> = {
  'distal-radius-locking-plate': {
    art: PlateHeads,
    caption: 'The head is the wider end that sits at the wrist. It comes narrow, standard or wide. Drawing, not to scale.',
  },
};

/**
 * T-Meter style callouts on a cut-out hero: a dot on the part (x, y as % of the square photo, before tilt),
 * a thin line, a few words. Words come from the device's own size rows. Wide screens only.
 */
export const callouts: Record<string, { x: number; y: number; side: 'r' | 'l' | 'b'; text: string }[]> = {
  'distal-radius-locking-plate': [
    { x: 13, y: 45, side: 'l', text: 'Head: narrow, standard or wide' },
    { x: 74, y: 55, side: 'r', text: 'Shaft holes set the length' },
  ],
};
