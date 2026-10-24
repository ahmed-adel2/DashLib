import type { Metadata } from "next";
import { StaffBoard } from "@/components/admin/staff-board";
import { DataNote, PageHeading } from "@/components/ui";
import { staff } from "@/lib/data";

export const metadata: Metadata = {
  title: "People",
};

export default function StaffPage() {
  const teacherCount = staff.filter((member) => member.role === "teacher").length;
  const adminCount = staff.filter((member) => member.role === "admin").length;

  return (
    <div>
      <PageHeading
        title="People"
        meta={
          <>
            <span>{staff.length} accounts</span>
            <span aria-hidden="true" className="text-moss">
              /
            </span>
            <span>
              {teacherCount} teachers · {adminCount} admins
            </span>
            <span aria-hidden="true" className="text-moss">
              /
            </span>
            <span>Role-based access</span>
          </>
        }
      />

      <StaffBoard initial={staff} />

      <div className="mt-4">
        <DataNote>
          Admins manage inventory, branches and reports. Teachers upload lessons, create tasks and
          clock their shifts. Students only see the catalog and their lessons — that boundary is
          enforced by Clerk roles and row-level security, not by hiding links.
        </DataNote>
      </div>
    </div>
  );
}
