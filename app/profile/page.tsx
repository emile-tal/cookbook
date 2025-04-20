import EditUsername from "../ui/profile/username";
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
            <div className="flex gap-8 items-center">
                <ProfilePhoto userData={userData} />
                <EditUsername username={userData.username} />
            </div>
        </main>
    )
}