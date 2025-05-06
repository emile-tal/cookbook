import Loading from "@/app/ui/loading";
import ProfileContent from "@/app/ui/profile/profile-content";
import { Suspense } from "react";
import { getUserPublicInfo } from "@/app/lib/data/user";

interface ProfileProps {
    params: Promise<{ id: string }>,
    searchParams: Promise<{ q?: string }>
}

export default async function Profile({ params, searchParams }: ProfileProps) {
    const { id } = await params;
    const { q } = await searchParams;

    const userPublicInfo = await getUserPublicInfo(id);

    if (!userPublicInfo) {
        return (
            <div className="container-spacing">
                User not found
            </div>
        )
    }

    return (
        <Suspense fallback={<Loading size={24} />}>
            <ProfileContent id={id} searchParams={q} />
        </Suspense>
    )
}