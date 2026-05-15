import { api } from "./api";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "SUPER_ADMIN" | "ADMIN" | "USER" | string;
  organizationId?: string;
  isEnabled?: boolean;
};

export function getStoredUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("user");
  if (!raw) return null;
  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    localStorage.removeItem("user");
    return null;
  }
}

export function storeUser(user: AuthUser) {
  localStorage.setItem("user", JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export async function refreshCurrentUser() {
  const user = await api.get("/auth/me");
  storeUser(user);
  return user as AuthUser;
}

export function routeForUser(user: AuthUser) {
  if (user.isEnabled === false) return "/account-disabled";
  if (user.role === "SUPER_ADMIN") return "/superadmin";
  if (user.role === "ADMIN") return "/dashboard";
  return "/unauthorized";
}
