import Link from "next/link";
import { StarMotif } from "@/components/icons";

export default function NotFound() {
  return (
    <div className="flex min-h-dvh items-center justify-center bg-plaster px-6">
      <div className="w-full max-w-[460px] border border-line bg-paper p-8 text-center">
        <StarMotif className="mx-auto h-4 w-4 text-gold" />
        <h1 className="mt-4 text-[28px] leading-tight text-ink">This shelf is empty</h1>
        <p className="mx-auto mt-2 max-w-[38ch] text-[12.5px] leading-relaxed text-stone">
          The page you asked for is not part of the catalog, the lesson library or the staff
          portals.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <Link
            href="/"
            className="inline-flex h-10 items-center rounded-sm bg-forest px-4 text-[13px] font-medium text-paper transition-colors hover:bg-forest-deep"
          >
            Back to the store
          </Link>
          <Link
            href="/learn"
            className="inline-flex h-10 items-center rounded-sm border border-moss bg-paper px-4 text-[13px] font-medium text-ink transition-colors hover:border-forest"
          >
            Lessons
          </Link>
        </div>
      </div>
    </div>
  );
}
