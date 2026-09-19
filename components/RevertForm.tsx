import { moderationAct } from "@/app/actions/auth";

export function RevertForm({ slug, revisionId }: { slug: string; revisionId: string }) {
  return (
    <form action={moderationAct}>
      <input type="hidden" name="action" value="revert" />
      <input type="hidden" name="slug" value={slug} />
      <input type="hidden" name="revisionId" value={revisionId} />
      <button type="submit" className="underline underline-offset-4">
        Revert
      </button>
    </form>
  );
}
