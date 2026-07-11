import Button from "./Button";

// Small chip shown near tool inputs reminding guests of their limits.
export function GuestHint({ show, text }: { show: boolean; text: string }) {
  if (!show) return null;
  return (
    <div className="border-l-4 border-yellow-400 bg-yellow-400/10 px-3 py-2">
      <p className="text-yellow-400 font-black uppercase tracking-widest text-[11px]">
        {"> "}
        {text}
      </p>
    </div>
  );
}

// Error line inside a status terminal, with an optional "sign up free" CTA
// (shown when the failure was a guest limit).
export function UpsellError({
  message,
  upsell,
}: {
  message: string;
  upsell?: boolean;
}) {
  return (
    <div className="text-red-500 font-black uppercase tracking-widest w-full">
      <p className="text-lg md:text-xl mb-4 animate-pulse">{"> " + message}</p>
      {upsell && (
        <Button size="sm" color="pink" shadow="green" href="/signup">
          SIGN UP FREE →
        </Button>
      )}
    </div>
  );
}
