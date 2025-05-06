import EditProfileClient from "@/app/ui/profile/edit-profile-client";
import NotLoggedIn from "@/app/ui/profile/not-logged-in";
import { getCurrentUser } from "@/app/lib/auth";
import { getUserPersonalInfo } from "@/app/lib/data/user";

export default async function EditProfilePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const user = await getCurrentUser();

    if (!user || user.id !== id) {
        return (
            <div>
                <NotLoggedIn />
            </div>
        )
    }

    const userData = await getUserPersonalInfo(user.id);

    if (!userData) {
        return (
            <div>
                <NotLoggedIn />
            </div>
        )
    }

    return <EditProfileClient userData={userData} id={id} />;
} 