"use client";

import { useMemo, useState } from "react";
import { StarMotif } from "@/components/icons";
import { Panel } from "@/components/ui";
import type { DaySales } from "@/lib/data";
import { compactCurrency, currency } from "@/lib/format";

const ranges = [7, 14, 30] as const;
type Range = (typeof ranges)[number];

const WIDTH = 720;
const HEIGHT = 240;
const PAD = { top: 14, right: 12, bottom: 26, left: 46 };

export function SalesChart({ data }: { data: DaySales[] }) {
  const [range, setRange] = useState<Range>(30);

  const series = useMemo(() => data.slice(-range), [data, range]);
  const total = series.reduce((sum, day) => sum + day.revenue, 0);
  const best = series.reduce((top, day) => (day.revenue > top.revenue ? day : top), series[0]);
  const peak = Math.max(...series.map((day) => day.revenue)) * 1.1;

  const plotWidth = WIDTH - PAD.left - PAD.right;
  const plotHeight = HEIGHT - PAD.top - PAD.bottom;

  const pointAt = (index: number, revenue: number) => {
    const x = PAD.left + (series.length === 1 ? 0 : (index / (series.length - 1)) * plotWidth);
    const y = PAD.top + plotHeight - (revenue / peak) * plotHeight;
    return { x, y };
  };

  const points = series.map((day, index) => pointAt(index, day.revenue));
  const line = points.map((point, index) => `${index === 0 ? "M" : "L"}${point.x.toFixed(1)} ${point.y.toFixed(1)}`).join(" ");
  const area = `${line} L${(PAD.left + plotWidth).toFixed(1)} ${PAD.top + plotHeight} L${PAD.left} ${
    PAD.top + plotHeight
  } Z`;

  const gridRows = [0, 0.5, 1].map((fraction) => ({
    y: PAD.top + plotHeight - fraction * plotHeight,
    value: peak * fraction,
  }));

  const lastPoint = points[points.length - 1];
  const today = series[series.length - 1];

  const labelIndexes = [0, Math.floor((series.length - 1) / 2), series.length - 1];

  return (
    <Panel ticks className="overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-4 py-3">
        <div className="flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1">
          <StarMotif className="h-2.5 w-2.5 text-gold" />
          <h2 className="text-[15px] leading-none text-ink">Revenue</h2>
          <span className="num text-[11.5px] text-stone">
            {currency(total)} in {range} days
          </span>
        </div>
        <div className="flex items-center gap-1" role="group" aria-label="Chart range">
          {ranges.map((option) => (
            <button
              key={option}
              type="button"
              aria-pressed={range === option}
              onClick={() => setRange(option)}
              className={`num rounded-sm px-2.5 py-1 text-[11px] transition-colors ${
                range === option
                  ? "bg-forest text-paper"
                  : "text-stone hover:bg-cream hover:text-ink"
              }`}
            >
              {option}d
            </button>
          ))}
        </div>
      </div>

      <div className="px-2 pb-2 pt-4 sm:px-3">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="h-auto w-full"
          role="img"
          aria-label={`Daily revenue for the last ${range} days. Highest day ${best.label} at ${currency(
            best.revenue,
          )}.`}
        >
          {gridRows.map((row) => (
            <g key={row.y}>
              <line
                x1={PAD.left}
                x2={WIDTH - PAD.right}
                y1={row.y}
                y2={row.y}
                stroke="#e3ddce"
                strokeDasharray={row.value === 0 ? undefined : "3 5"}
              />
              <text
                x={PAD.left - 8}
                y={row.y + 3}
                textAnchor="end"
                fontSize={9}
                className="fill-stone"
              >
                {compactCurrency(row.value)}
              </text>
            </g>
          ))}

          <path d={area} fill="#1b3d2e" fillOpacity="0.08" />
          <path d={line} fill="none" stroke="#1b3d2e" strokeWidth="1.75" strokeLinejoin="round" />

          {lastPoint ? (
            <g>
              <line
                x1={lastPoint.x}
                x2={lastPoint.x}
                y1={PAD.top}
                y2={PAD.top + plotHeight}
                stroke="#b0863c"
                strokeDasharray="2 4"
              />
              <circle cx={lastPoint.x} cy={lastPoint.y} r="3.6" fill="#a5382c" />
              <circle cx={lastPoint.x} cy={lastPoint.y} r="1.4" fill="#fffdf7" />
            </g>
          ) : null}

          {labelIndexes.map((index) => {
            const day = series[index];
            const point = points[index];
            if (!day || !point) return null;
            return (
              <text
                key={day.date}
                x={point.x}
                y={HEIGHT - 8}
                textAnchor={index === 0 ? "start" : index === series.length - 1 ? "end" : "middle"}
                fontSize={9}
                className="fill-stone"
              >
                {day.label}
              </text>
            );
          })}
        </svg>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-line px-4 py-2.5 text-[11px] text-stone">
        <span>
          Today <span className="num text-ink">{today ? currency(today.revenue) : "—"}</span>
        </span>
        <span>
          Best day <span className="num text-ink">{best ? `${best.label} · ${currency(best.revenue)}` : "—"}</span>
        </span>
        <span>
          Range peak <span className="num text-ink">{compactCurrency(peak / 1.1)}</span>
        </span>
      </div>
    </Panel>
  );
}
