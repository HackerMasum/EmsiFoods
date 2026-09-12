import { Suspense } from "react";
import LoginForm from "./login-form";

function LoginFallback() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-12 sm:py-16">
      <div className="mx-auto w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto h-8 w-32 animate-pulse rounded bg-slate-200" />

          <div className="mx-auto mt-6 h-9 w-52 animate-pulse rounded bg-slate-200" />

          <div className="mx-auto mt-3 h-4 w-72 max-w-full animate-pulse rounded bg-slate-200" />
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="animate-pulse space-y-5">
            <div className="h-12 w-full rounded-xl bg-slate-200" />
            <div className="h-12 w-full rounded-xl bg-slate-200" />
            <div className="h-12 w-full rounded-xl bg-slate-200" />
          </div>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}