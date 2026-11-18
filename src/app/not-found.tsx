import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid min-h-screen place-items-center bg-canvas px-6">
      <div className="max-w-md text-center">
        <p className="text-6xl font-bold text-primary">404</p>
        <h1 className="mt-3 text-2xl font-bold">Page not found</h1>
        <p className="mt-2 text-sm text-ink-2">
          The page you are looking for doesn&apos;t exist or was moved.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 inline-flex h-10 items-center rounded-md bg-primary px-4 text-sm font-semibold text-on-primary shadow-sm hover:bg-primary-hover"
        >
          Back to Overview
        </Link>
      </div>
    </div>
  );
}
