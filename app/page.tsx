import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-6xl flex-col items-center px-6 py-16 sm:px-16">
        {/* Hero Section */}
        <div className="mb-16 flex flex-col items-center text-center">
          <h1 className="mb-6 text-5xl font-bold text-black dark:text-zinc-50">
            CookBot
          </h1>
          <p className="mb-8 max-w-2xl text-xl text-zinc-600 dark:text-zinc-400">
            Your AI-powered cooking assistant that helps you discover delicious
            recipes with ingredients you already have.
          </p>
          <div className="flex gap-4">
            <Link
              href="/auth/signup"
              className="rounded-full bg-black px-8 py-3 text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200"
            >
              Get Started
            </Link>
            <Link
              href="/auth/login"
              className="rounded-full border border-black px-8 py-3 text-black transition-colors hover:bg-zinc-100 dark:border-white dark:text-white dark:hover:bg-zinc-900"
            >
              Login
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
            <h3 className="mb-3 text-xl font-semibold text-black dark:text-zinc-50">
              Recipe Generation
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              AI suggests dishes based on ingredients you have available
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
            <h3 className="mb-3 text-xl font-semibold text-black dark:text-zinc-50">
              Step-by-step Instructions
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Clear, simple cooking guidelines for every recipe
            </p>
          </div>
          <div className="rounded-xl border border-zinc-200 p-6 dark:border-zinc-800">
            <h3 className="mb-3 text-xl font-semibold text-black dark:text-zinc-50">
              Nutrition Tips
            </h3>
            <p className="text-zinc-600 dark:text-zinc-400">
              Get helpful nutrition information and healthier alternatives
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
