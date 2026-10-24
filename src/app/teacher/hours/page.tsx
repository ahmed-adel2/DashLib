import type { Metadata } from "next";
import { DataNote, Panel, PanelHead, PageHeading, Stat } from "@/components/ui";
import { ScrollShade } from "@/components/ui/scroll-shade";
import { shifts } from "@/lib/data";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Shift hours",
};

const chronological = [...shifts].reverse();
const totalHours = Math.round(shifts.reduce((total, shift) => total + shift.hours, 0) * 100) / 100;
const averageHours = Math.round((totalHours / shifts.length) * 100) / 100;
const longestShift = Math.max(...shifts.map((shift) => shift.hours));
const SCALE_HOURS = 9;

const weekday = (date: string) =>
  new Intl.DateTimeFormat("en-US", { weekday: "short", timeZone: "UTC" }).format(new Date(date));

export default function TeacherHoursPage() {
  return (
    <div>
      <PageHeading
        title="Shift hours"
        meta={
          <>
            <span>{shifts.length} shifts logged</span>
            <span aria-hidden="true" className="text-moss">
              /
            </span>
            <span>Clocked at the Main Branch</span>
          </>
        }
      />

      <div className="grid gap-4">
        <Panel ticks>
          <div className="grid divide-y divide-line sm:grid-cols-3 sm:divide-x sm:divide-y-0">
            <div className="p-5">
              <Stat
                label="Hours logged"
                value={totalHours.toFixed(1)}
                sub={`Across ${shifts.length} shifts this period`}
              />
            </div>
            <div className="p-5">
              <Stat label="Average shift" value={`${averageHours.toFixed(1)} h`} sub="Arrival to clock-out" />
            </div>
            <div className="p-5">
              <Stat label="Longest shift" value={`${longestShift.toFixed(1)} h`} sub="Includes the afternoon rush" />
            </div>
          </div>
        </Panel>

        <div className="grid gap-4 lg:grid-cols-[1.3fr_1fr] lg:items-start">
          <Panel>
            <PanelHead title="Hours by shift" hint={`Last ${shifts.length} shifts`} />
            <div className="px-4 pb-4 pt-5">
              <div className="flex items-end gap-2 sm:gap-3">
                {chronological.map((shift) => (
                  <div key={shift.id} className="flex min-w-0 flex-1 flex-col items-center gap-2">
                    <span className="num text-[10px] text-stone">{shift.hours.toFixed(1)}</span>
                    <div className="flex h-[128px] w-full items-end bg-cream">
                      <div
                        className="w-full bg-forest"
                        style={{ height: `${Math.round((shift.hours / SCALE_HOURS) * 100)}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-stone">{weekday(shift.date)}</span>
                    <span className="num text-[9.5px] text-stone">{formatDate(shift.date)}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-line pt-2 text-[10px] text-stone">
                <span>Scale: 0 – {SCALE_HOURS} h</span>
                <span>Bars are drawn from the shift records</span>
              </div>
            </div>
          </Panel>

          <Panel className="min-w-0">
            <PanelHead title="Shift records" hint="Most recent first" />
            <ScrollShade>
              <table className="tbl">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th className="num">In</th>
                    <th className="num">Out</th>
                    <th className="num">Hours</th>
                  </tr>
                </thead>
                <tbody>
                  {shifts.map((shift) => (
                    <tr key={shift.id}>
                      <td className="text-[12.5px] text-ink">
                        {formatDate(shift.date)}
                        <span className="ml-2 text-[10.5px] text-stone">{weekday(shift.date)}</span>
                      </td>
                      <td className="num text-right text-[12px] text-stone" data-label="In">
                        {shift.clockIn}
                      </td>
                      <td className="num text-right text-[12px] text-stone" data-label="Out">
                        {shift.clockOut}
                      </td>
                      <td className="num text-right text-[12px] text-ink" data-label="Hours">
                        {shift.hours.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ScrollShade>
            <div className="border-t border-line px-4 py-3">
              <DataNote>
                These rows are sample records. Clock-in and clock-out are recorded from this
                device and will write to the shifts table once Supabase is connected.
              </DataNote>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
