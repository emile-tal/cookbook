'use client'

import { BookInvitation, RecipeInvitation } from "@/app/types/definitions"

import Image from "next/image"
import MenuBookIcon from '@mui/icons-material/MenuBook'
import PrimaryButton from "../buttons/primary-button"
import SecondaryButton from "../buttons/secondary-button"
import { addUserToBookPermissions } from "@/app/lib/data/recipebookpermissions"
import { rejectBookInvitation } from "@/app/lib/data/recipebookinvitations"
import { rejectRecipeInvitation } from "@/app/lib/data/recipeinvitations"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

interface UnreadFeedProps {
    bookInvitations: BookInvitation[]
    recipeInvitations: RecipeInvitation[]
}

export default function UnreadFeed({ bookInvitations, recipeInvitations }: UnreadFeedProps) {
    const router = useRouter()
    const { data: session, status } = useSession()

    const invitations = [...bookInvitations, ...recipeInvitations].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    if (status === 'loading') {
        return <div>Loading...</div>
    }

    if (!session?.user.id) {
        router.push('/login')
        return
    }

    async function acceptInvitation(invitationId: string, id: string, canEdit: boolean) {
        if (!session?.user.id) {
            router.push('/login')
            return
        }
        await addUserToBookPermissions(invitationId, id, canEdit, session?.user.id)
        router.refresh()
    }

    async function declineInvitation(invitationId: string, isBookInvitation: boolean) {
        if (!session?.user.id) {
            router.push('/login')
            return
        }
        if (isBookInvitation) {
            await rejectBookInvitation(invitationId)
        } else {
            await rejectRecipeInvitation(invitationId)
        }
        router.refresh()
    }

    return (
        <div className="flex flex-col gap-4">
            {invitations.map((invitation) => (
                <div key={invitation.id} className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
                    <div className="flex items-start gap-4">
                        <div className="flex-1">
                            <div className="flex justify-between">
                                <h3 className="font-medium">
                                    <span className="text-black font-bold">{invitation.sender_username}</span>
                                    <span className="text-gray-600"> has invited you to <span className="font-bold">{invitation.can_edit ? 'edit' : 'view'}</span> the following {('book_id' in invitation) ? 'book' : 'recipe'}:</span>
                                </h3>
                                <span className="text-xs text-gray-500">
                                    {new Date(invitation.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="mt-2 flex gap-4">
                                <button className="flex gap-2 flex-col" onClick={() => {
                                    if ('book_id' in invitation) {
                                        router.push(`/books/${invitation.book_id}`)
                                    } else if ('recipe_id' in invitation) {
                                        router.push(`/recipes/${invitation.recipe_id}`)
                                    }
                                }}>
                                    <h4 className="text-lg font-semibold text-text">
                                        {'book_name' in invitation ? invitation.book_name : invitation.recipe_title}
                                    </h4>
                                    <div className="min-w-20 min-h-20 bg-gray-50 rounded-lg">
                                        {('book_image_url' in invitation && invitation.book_image_url) || ('recipe_image_url' in invitation && invitation.recipe_image_url) ? (
                                            <Image
                                                src={'book_image_url' in invitation ? invitation.book_image_url! : invitation.recipe_image_url!}
                                                alt={'book_name' in invitation ? invitation.book_name : invitation.recipe_title}
                                                fill
                                                className="object-cover rounded-lg"
                                            />
                                        ) : (
                                            <div className="min-w-full min-h-full flex items-center justify-center bg-gray-50">
                                                <MenuBookIcon className="text-gray-300 scale-[200%]" />
                                            </div>
                                        )}
                                    </div>
                                </button>
                                {invitation.message && (
                                    <p className="text-sm text-gray-600 italic bg-gray-50 px-8 py-4 rounded-md flex-1 flex items-center">
                                        {`"${invitation.message}"`}
                                    </p>
                                )}
                            </div>

                            <div className="mt-4 flex gap-3 justify-end">
                                <SecondaryButton
                                    onClick={() => { declineInvitation(invitation.id, 'book_id' in invitation) }}
                                    text="Decline"
                                />
                                <PrimaryButton
                                    onClick={() => {
                                        acceptInvitation(
                                            invitation.id,
                                            'book_id' in invitation ? invitation.book_id : invitation.recipe_id,
                                            invitation.can_edit
                                        )
                                    }}
                                    type="button"
                                    text="Accept"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}