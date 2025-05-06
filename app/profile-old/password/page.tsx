import ChangePassword from "@/app/ui/profile/change-password";
import NotLoggedIn from "@/app/ui/profile/not-logged-in";
import { getCurrentUser } from "@/app/lib/auth";

export default async function PasswordPage() {
    const user = await getCurrentUser();
    if (!user) {
        return (
            <div className="container-spacing">
                <NotLoggedIn />
            </div>
        )
    }
    return (
        <main className="container-spacing mb-8">
            <div className="flex gap-8 flex-col items-center min-w-full mt-8">
                <ChangePassword />
            </div>
        </main>
    )
}