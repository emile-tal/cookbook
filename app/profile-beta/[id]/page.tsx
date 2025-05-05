import Loading from "@/app/ui/loading";
import ProfileContent from "@/app/ui/profile-beta/profile-content";
import ProfileHeader from "@/app/ui/profile-beta/profile-header";
import { Suspense } from "react";
import { getUserPublicInfo } from "@/app/lib/data/user";

export default async function ProfileBeta({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    const userPublicInfo = await getUserPublicInfo(id);

    if (!userPublicInfo) {
        return (
            <div className="container-spacing">
                User not found
            </div>
        )
    }



    return (
        <main>
            <ProfileHeader userPublicInfo={userPublicInfo} />
            <Suspense fallback={<Loading size={24} />}>
                <ProfileContent params={params} />
            </Suspense>
        </main>
    )
}