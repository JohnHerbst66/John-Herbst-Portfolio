import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import LoginForm from "@/components/LoginForm";
import { SESSION_COOKIE_NAME, verifyToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  // Already signed in? Skip straight to the upload page.
  if (verifyToken(cookies().get(SESSION_COOKIE_NAME)?.value)) {
    redirect("/admin");
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </main>
  );
}
