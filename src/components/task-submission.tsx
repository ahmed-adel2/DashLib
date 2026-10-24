"use client";

import { useEffect, useState } from "react";
import { IconCheck, IconUpload } from "@/components/icons";
import { Button, Field, Panel } from "@/components/ui";
import { formatDate, formatTime } from "@/lib/format";

const STORAGE_KEY = "dashlib.submissions.v1";

type Submission = {
  taskId: string;
  at: string;
  note: string;
  file: string | null;
};

const isSubmission = (value: unknown): value is Submission => {
  if (typeof value !== "object" || value === null) return false;
  const candidate = value as {
    taskId?: unknown;
    at?: unknown;
    note?: unknown;
    file?: unknown;
  };
  return (
    typeof candidate.taskId === "string" &&
    typeof candidate.at === "string" &&
    typeof candidate.note === "string" &&
    (candidate.file === null || typeof candidate.file === "string")
  );
};

export function TaskSubmission({
  taskId,
  title,
  instructions,
  due,
  points,
}: {
  taskId: string;
  title: string;
  instructions: string;
  due: string;
  points: number;
}) {
  const [note, setNote] = useState("");
  const [file, setFile] = useState<string | null>(null);
  const [saved, setSaved] = useState<Submission | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          const found = parsed.filter(isSubmission).find((entry) => entry.taskId === taskId);
          if (found) {
            setSaved(found);
            setNote(found.note);
            setFile(found.file);
          }
        }
      }
    } catch {
      /* no stored submission on this device */
    }
    setLoaded(true);
  }, [taskId]);

  const submit = () => {
    if (note.trim().length < 12) {
      setError("Write at least a full sentence so your teacher knows what you did.");
      return;
    }

    const entry: Submission = {
      taskId,
      at: new Date().toISOString(),
      note: note.trim(),
      file,
    };

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      const parsed: unknown = raw ? JSON.parse(raw) : [];
      const existing = Array.isArray(parsed) ? parsed.filter(isSubmission) : [];
      const next = [...existing.filter((item) => item.taskId !== taskId), entry];
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* the confirmation still shows for this session */
    }

    setSaved(entry);
    setError(null);
  };

  return (
    <Panel ticks>
      <div className="border-b border-line px-4 py-3.5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="lbl">Attached task</div>
            <h2 className="mt-1 text-[17px] leading-snug text-ink">{title}</h2>
          </div>
          {saved ? (
            <span
              role="status"
              className="inline-flex shrink-0 items-center gap-1 rounded-sm bg-forest-tint px-2 py-1 text-[10px] font-medium uppercase tracking-[0.1em] text-forest"
            >
              <IconCheck className="h-3 w-3" />
              Handed in
            </span>
          ) : null}
        </div>
        <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-stone">
          <span>Due {formatDate(due)}</span>
          <span className="num">{points} points</span>
        </div>
      </div>

      <div className="p-4">
        <p className="text-[12.5px] leading-relaxed text-ink/85">{instructions}</p>

        {!loaded ? (
          <p role="status" className="mt-4 text-[12px] text-stone">
            Loading your submission…
          </p>
        ) : saved ? (
          <div className="mt-4">
            <div className="border border-line bg-cream p-3">
              <div className="flex items-center justify-between gap-3">
                <span className="lbl">Submitted</span>
                <span className="num text-[11px] text-stone">{formatTime(saved.at)}</span>
              </div>
              <p className="mt-2 whitespace-pre-line text-[12.5px] leading-relaxed text-ink">
                {saved.note}
              </p>
              {saved.file ? (
                <p className="mt-2 text-[11.5px] text-stone">Attachment: {saved.file}</p>
              ) : null}
            </div>
            <Button variant="secondary" size="sm" className="mt-3" onClick={() => setSaved(null)}>
              Submit a new version
            </Button>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            <Field label="Your answer" htmlFor="task-note">
              <textarea
                id="task-note"
                className="field min-h-[104px] resize-y"
                maxLength={2000}
                value={note}
                onChange={(event) => setNote(event.target.value)}
                placeholder="Explain what you did and where you got stuck."
              />
            </Field>

            <Field label="Attachment" htmlFor="task-file" hint="Optional: photo of your working, or a PDF (max 10MB).">
              <input
                id="task-file"
                type="file"
                accept=".pdf,.png,.jpg,.jpeg,.webp"
                aria-describedby="task-file-hint"
                onChange={(event) => {
                  const selected = event.target.files?.[0];
                  if (selected && selected.size > 10 * 1024 * 1024) {
                    setError("File size exceeds 10MB limit. Please choose a smaller file.");
                    event.target.value = "";
                    setFile(null);
                    return;
                  }
                  setError(null);
                  setFile(selected?.name ?? null);
                }}
                className="block w-full text-[12px] text-stone file:mr-3 file:cursor-pointer file:border file:border-moss file:bg-paper file:px-3 file:py-1.5 file:text-[12px] file:text-ink"
              />
            </Field>

            {file ? (
              <p className="num flex items-center gap-1.5 text-[11.5px] text-forest">
                <IconUpload className="h-3.5 w-3.5" />
                {file}
              </p>
            ) : null}

            {error ? (
              <p role="alert" className="border border-brick/30 bg-brick-wash px-3 py-2 text-[11.5px] text-brick">
                {error}
              </p>
            ) : null}

            <Button className="w-full" onClick={submit}>
              Hand in task
            </Button>
            <p className="text-[11px] leading-relaxed text-stone">
              Submissions are saved in this browser until student accounts and storage are connected.
            </p>
          </div>
        )}
      </div>
    </Panel>
  );
}
