import EditUsername from "../ui/profile/username";
import Link from "next/link";
import NotLoggedIn from "../ui/profile/not-logged-in";
import ProfilePhoto from "../ui/profile/profile-photo";
import { getCurrentUser } from "../lib/auth";
import { getUser } from "@/app/lib/data/user";

export default async function Page() {
    const user = await getCurrentUser();

    if (!user) {
        return (
            <div className="container-spacing">
                <NotLoggedIn />
            </div>
        )
    }

    const userData = await getUser(user.id);

    if (!userData) {
        return (
            <div className="container-spacing">
                <NotLoggedIn />
            </div>
        )
    }

    return (
        <main className="container-spacing mb-8">
            <div className="flex gap-8 flex-col items-center min-w-full mt-8">
                <ProfilePhoto userData={userData} />
                <EditUsername username={userData.username} />
                <Link href="/profile/password">Change Password</Link>
            </div>
        </main>
    )
}