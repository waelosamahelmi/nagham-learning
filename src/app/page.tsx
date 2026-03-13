import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="font-heading text-5xl font-bold tracking-tight">
        NaghamOS
      </h1>
      <p className="mt-4 text-text-secondary text-lg">
        Creative Growth Engine
      </p>
      <Link
        href="/login"
        className="mt-8 rounded-xl bg-figma px-8 py-3 font-semibold text-white transition-shadow hover:shadow-[0_0_20px_rgba(162,89,255,0.4)]"
      >
        Get Started
      </Link>
    </div>
  );
}
