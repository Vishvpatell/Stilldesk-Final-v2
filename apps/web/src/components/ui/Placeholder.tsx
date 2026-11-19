import { isUnresolved, placeholders, value } from "@/config/site.config";

/** Shows the real value once it is filled in; until then, a clearly marked placeholder chip. */
export function Placeholder({ token }: { token: string }) {
  if (!isUnresolved(token)) return <>{value(token)}</>;
  return (
    <span className="ph" data-placeholder={token} title={`Placeholder ${token}: fill it in src/config/site.config.ts`}>
      [{placeholders[token]?.label ?? token}]
    </span>
  );
}
