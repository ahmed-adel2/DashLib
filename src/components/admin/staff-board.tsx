"use client";

import { useState } from "react";
import { IconCheck } from "@/components/icons";
import { Badge, Button, Field, Panel, PanelHead, StarRule } from "@/components/ui";
import { ScrollShade } from "@/components/ui/scroll-shade";
import { branches, type BranchId, type Role, type StaffMember, type StaffStatus } from "@/lib/data";
import { formatDate, initials } from "@/lib/format";

const statusTone: Record<StaffStatus, "forest" | "gold" | "outline"> = {
  active: "forest",
  invited: "gold",
  paused: "outline",
};

const statusLabel: Record<StaffStatus, string> = {
  active: "Active",
  invited: "Invited",
  paused: "Paused",
};

export function StaffBoard({ initial }: { initial: StaffMember[] }) {
  const [members, setMembers] = useState<StaffMember[]>(initial);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("teacher");
  const [branch, setBranch] = useState<BranchId>("main");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const invite = () => {
    if (name.trim().length < 2) {
      setError("Enter the person's full name.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a school email address.");
      return;
    }
    if (members.some((member) => member.email.toLowerCase() === email.trim().toLowerCase())) {
      setError("That email already has access. Use a different address.");
      return;
    }

    const member: StaffMember = {
      id: `local-${Date.now()}`,
      name: name.trim(),
      email: email.trim(),
      role,
      title: role === "teacher" ? "Teacher" : "Administrator",
      branch,
      status: "invited",
      since: new Date().toISOString().slice(0, 10),
    };

    setMembers((current) => [...current, member]);
    setNotice(`Invitation prepared for ${member.name}. Clerk sends the email once auth is connected.`);
    setError(null);
    setName("");
    setEmail("");
  };

  const toggleStatus = (id: string) => {
    setMembers((current) =>
      current.map((member) => {
        if (member.id !== id) return member;
        if (member.status === "active") return { ...member, status: "paused" };
        if (member.status === "paused") return { ...member, status: "active" };
        return member;
      }),
    );
  };

  const activeCount = members.filter((member) => member.status === "active").length;

  return (
    <div className="grid gap-5 xl:grid-cols-[1fr_340px] xl:items-start">
      <Panel className="min-w-0">
        <PanelHead title="Accounts" hint={`${members.length} people · ${activeCount} active`} />
        <ScrollShade>
          <table className="tbl">
            <thead>
              <tr>
                <th>Name</th>
                <th>Role</th>
                <th>Branch</th>
                <th>Status</th>
                <th className="num">Since</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {members.map((member) => (
                <tr key={member.id}>
                  <td className="min-w-[190px]">
                    <div className="flex items-center gap-2.5">
                      <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-sm bg-sage text-[10.5px] font-medium text-forest">
                        {initials(member.name)}
                      </span>
                      <div className="min-w-0">
                        <span className="block text-[12.5px] font-medium text-ink">
                          {member.name}
                        </span>
                        <span className="block truncate text-[10.5px] text-stone">
                          {member.email}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="text-[12px] text-stone" data-label="Role">
                    <span className="capitalize">{member.role}</span>
                    <span className="block text-[10.5px]">{member.title}</span>
                  </td>
                  <td className="text-[12px] text-stone" data-label="Branch">
                    {branches.find((item) => item.id === member.branch)?.shortName}
                  </td>
                  <td data-label="Status">
                    <Badge tone={statusTone[member.status]}>{statusLabel[member.status]}</Badge>
                  </td>
                  <td className="num text-right text-[11.5px] text-stone" data-label="Since">
                    {formatDate(member.since)}
                  </td>
                  <td className="text-right">
                    {member.status === "invited" ? (
                      <span className="text-[11px] text-stone">Awaiting sign-in</span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => toggleStatus(member.id)}
                        className="text-[11px] text-forest hover:underline"
                      >
                        {member.status === "active" ? "Pause access" : "Restore access"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </ScrollShade>
        <div className="border-t border-line px-4 py-3">
          <p className="text-[11px] leading-relaxed text-stone">
            Only admins see this table. Teachers get their portal and nothing else; students never
            reach a staff route.
          </p>
        </div>
      </Panel>

      <Panel ticks className="p-4">
        <StarRule label="Add a colleague" />

        <div className="mt-4 space-y-3.5">
          <Field label="Full name" htmlFor="staff-name">
            <input
              id="staff-name"
              className="field"
              maxLength={80}
              required
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Lina Aziz"
            />
          </Field>

          <Field label="Email" htmlFor="staff-email">
            <input
              id="staff-email"
              type="email"
              className="field"
              maxLength={120}
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="lina@dashlib.school"
            />
          </Field>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <Field label="Role" htmlFor="staff-role">
              <select
                id="staff-role"
                className="field"
                value={role}
                onChange={(event) => setRole(event.target.value as Role)}
              >
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>
            </Field>
            <Field label="Branch" htmlFor="staff-branch">
              <select
                id="staff-branch"
                className="field"
                value={branch}
                onChange={(event) => setBranch(event.target.value as BranchId)}
              >
                {branches.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.shortName}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          {error ? (
            <p role="alert" className="border border-brick/30 bg-brick-wash px-3 py-2 text-[11.5px] text-brick">
              {error}
            </p>
          ) : null}

          {notice ? (
            <p className="flex items-start gap-2 border border-line bg-forest-tint px-3 py-2 text-[11.5px] text-forest">
              <IconCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {notice}
            </p>
          ) : null}

          <Button size="sm" className="w-full" onClick={invite}>
            Create account
          </Button>
          <p className="text-[10.5px] leading-relaxed text-stone">
            Accounts are prepared here and created in Clerk when authentication is connected; until
            then the row stays marked as invited.
          </p>
        </div>
      </Panel>
    </div>
  );
}
