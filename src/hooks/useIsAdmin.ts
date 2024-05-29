import { useAuthProvider } from "@/providers/AuthProvider";

export default function useIsAdmin() {
    const { role } = useAuthProvider();
    return role === "admin";
}