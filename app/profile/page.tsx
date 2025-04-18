import EditUsername from "../ui/profile/username";
import ProfilePhoto from "../ui/profile/profile-photo";
import { getCurrentUser } from "../lib/auth";
import { getUser } from "@/app/lib/data/user";

export default async function Page() {
    const user = await getCurrentUser();

    if (!user) {
        return <div>User not found</div>
    }

    const userData = await getUser(user?.id)

    if (!userData || !user.username) {
        return <div>User not found</div>
    }

    return (
        <main className="container-spacing mb-8">
            <div className="flex gap-8 items-center">
                <ProfilePhoto userData={userData} />
                <EditUsername username={user.username} />
            </div>
        </main>
    )
}