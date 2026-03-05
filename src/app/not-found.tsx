import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-6xl font-bold text-zinc-300 dark:text-zinc-700">404</h1>
      <p className="mt-4 text-lg text-zinc-600 dark:text-zinc-400">
        Page not found
      </p>
      <Link
        href="/"
        className="mt-6 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
      >
        Go Home
      </Link>
    </main>
  );
}
