import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import AdminUploadForm from "@/components/AdminUploadForm";
import LogoutButton from "@/components/LogoutButton";
import { SESSION_COOKIE_NAME, verifyToken } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default function AdminPage() {
  if (!verifyToken(cookies().get(SESSION_COOKIE_NAME)?.value)) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-md space-y-4">
        <AdminUploadForm />
        <LogoutButton />
      </div>
    </main>
  );
}
