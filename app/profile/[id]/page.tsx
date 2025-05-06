import Loading from "@/app/ui/loading";
import ProfileAside from "@/app/ui/profile-beta/profile-aside";
import ProfileContent from "@/app/ui/profile-beta/profile-content";
import { Suspense } from "react";
import { getUserPublicInfo } from "@/app/lib/data/user";

interface ProfileBetaProps {
    params: Promise<{ id: string }>,
    searchParams: Promise<{ q?: string }>
}

export default async function ProfileBeta({ params, searchParams }: ProfileBetaProps) {
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
        <main className="flex flex-col gap-8 sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            <ProfileAside userPublicInfo={userPublicInfo} />
            <Suspense fallback={<Loading size={24} />}>
                <ProfileContent params={params} searchParams={searchParams} />
            </Suspense>
        </main>
    )
}