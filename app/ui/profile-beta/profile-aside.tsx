'use client'

import Image from "next/image"
import { Person } from "@mui/icons-material"
import ProfileNav from "./profile-nav"
import { UserPublicInfo } from "@/app/types/definitions"

interface ProfileAsideProps {
    userPublicInfo: UserPublicInfo
}

export default function ProfileAside({ userPublicInfo }: ProfileAsideProps) {


    return (
        <div className="w-full sm:col-span-1 sm:sticky sm:top-4 sm:self-start">
            <aside className="bg-white rounded-xl border border-gray-100 shadow-sm py-8 px-4">
                <div className="flex flex-col items-center gap-6">
                    <div className="relative min-w-32 h-32 rounded-full overflow-hidden bg-gray-100 border-2 border-gray-200">
                        {userPublicInfo.user_image_url ? (
                            <Image
                                src={userPublicInfo.user_image_url}
                                alt="User avatar"
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center w-full h-full">
                                <Person className="text-gray-400 text-4xl scale-[175%]" />
                            </div>
                        )}
                    </div>

                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-3">{userPublicInfo.username}</h1>
                        <div className="flex gap-4 text-gray-600 min-w-full justify-center">
                            <div>
                                <p className="text-2xl font-semibold text-gray-900">{userPublicInfo.book_count}</p>
                                <p className="text-sm text-gray-500">{userPublicInfo.book_count === 1 ? "Book" : "Books"}</p>
                            </div>
                            <div>
                                <p className="text-2xl font-semibold text-gray-900">{userPublicInfo.recipe_count}</p>
                                <p className="text-sm text-gray-500">{userPublicInfo.recipe_count === 1 ? "Recipe" : "Recipes"}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <ProfileNav id={userPublicInfo.id} />
            </aside>
        </div>
    )
}