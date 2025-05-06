'use server'

import ProfileAside from "./profile-aside";
import { getUserPublicInfo } from "@/app/lib/data/user";

export default async function ProfileAsideWrapper({ id }: { id: string }) {
    const userPublicInfo = await getUserPublicInfo(id);

    if (!userPublicInfo) {
        return (
            <div className="container-spacing">
                User not found
            </div>
        )
    }

    return (
        <div>
            <ProfileAside userPublicInfo={userPublicInfo} />
        </div>
    )
}