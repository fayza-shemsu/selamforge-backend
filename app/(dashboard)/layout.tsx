import DashboardShell from "@/components/DashboardShell";
import { clearToken, getToken } from "@/lib/auth";
import { decodeTokenClaims } from "@/lib/auth-token";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const token = await getToken();

  if (!token) {
    redirect("/login?expired=1");
  }

  const claims = decodeTokenClaims(token);

  return (
    <DashboardShell
      role={claims?.role ?? "Admin"}
      signOutAction={clearToken}
    >
      {children}
    </DashboardShell>
  );
}