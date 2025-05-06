'use client'

import EditUsername from "./username";
import PrimaryButton from "../buttons/primary-button";
import ProfilePhoto from "./profile-photo";
import SecondaryButton from "../buttons/secondary-button";
import { UserPersonalInfo } from "@/app/types/definitions";
import { useRouter } from "next/navigation";

interface EditProfileClientProps {
    userData: UserPersonalInfo;
    id: string;
}

export default function EditProfileClient({ userData, id }: EditProfileClientProps) {
    const router = useRouter();

    return (
        <div className="mt-8 sm:col-span-2 md:col-span-3">
            <div className="grid grid-cols-2 gap-8">
                <ProfilePhoto userData={userData} />
                <div className="sm:col-span-1 flex flex-col gap-4 sm:min-w-full col-span-1">
                    <EditUsername username={userData.username} />
                    <SecondaryButton
                        onClick={() => router.push(`/profile/${id}/edit/password`)}
                        text="Change Password"
                    />
                </div>
            </div>
            <div className="flex justify-center min-w-full sm:grid-cols-2 mt-8">
                <PrimaryButton
                    onClick={() => router.push(`/profile/${id}`)}
                    text="Done"
                    type="button"
                />
            </div>
        </div>
    )
} 