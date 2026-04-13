import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center">
      <p className="mt-8 text-center text-xl font-semibold md:text-2xl">
        Not all those who wander are lost, but you are.
      </p>
      <Link
        href="/top/1"
        className="border-primary bg-secondary hover:bg-tertiary mt-4 rounded-sm border px-3 py-1.5 text-sm focus-visible:ring-1 focus-visible:ring-blue-500"
      >
        Go back to home
      </Link>
    </div>
  );
}
