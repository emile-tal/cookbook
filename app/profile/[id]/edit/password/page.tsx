import ChangePassword from "@/app/ui/profile/change-password";
import NotLoggedIn from "@/app/ui/profile/not-logged-in";
import { getCurrentUser } from "@/app/lib/auth";

export default async function PasswordPage() {
    const user = await getCurrentUser();
    if (!user) {
        return (
            <div>
                <NotLoggedIn />
            </div>
        )
    }
    return (
        <div className="mb-8 min-w-full sm:col-span-2 md:col-span-3 lg:col-span-4">
            <div className="flex gap-8 flex-col items-center w-full mt-8">
                <ChangePassword id={user.id} />
            </div>
        </div>
    )
}