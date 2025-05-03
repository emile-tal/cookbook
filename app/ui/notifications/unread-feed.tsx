'use client'

import Image from "next/image"
import { Invitation } from "@/app/types/definitions"
import MenuBookIcon from '@mui/icons-material/MenuBook'
import PrimaryButton from "../buttons/primary-button"
import SecondaryButton from "../buttons/secondary-button"
import { addUserToPermissions } from "@/app/lib/data/permissions"
import { rejectInvitation } from "@/app/lib/data/invitations"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"

export default function UnreadFeed({ invitations }: { invitations: Invitation[] }) {
    const router = useRouter()
    const { data: session, status } = useSession()

    if (status === 'loading') {
        return <div>Loading...</div>
    }

    if (!session?.user.id) {
        router.push('/login')
        return
    }

    async function acceptInvitation(invitationId: string, bookId: string, canEdit: boolean) {
        if (!session?.user.id) {
            router.push('/login')
            return
        }
        await addUserToPermissions(invitationId, bookId, canEdit, session?.user.id)
        router.refresh()
    }

    async function declineInvitation(invitationId: string) {
        if (!session?.user.id) {
            router.push('/login')
            return
        }
        await rejectInvitation(invitationId)
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
                                    <span className="text-gray-600"> has invited you to <span className="font-bold">{invitation.can_edit ? 'edit' : 'view'}</span> the following book:</span>
                                </h3>
                                <span className="text-xs text-gray-500">
                                    {new Date(invitation.created_at).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="mt-2 flex gap-4">
                                <button className="flex gap-2 flex-col" onClick={() => {
                                    router.push(`/books/${invitation.book_id}`)
                                }}>
                                    <h4 className="text-lg font-semibold text-text">{invitation.book_name}</h4>
                                    <div className="min-w-20 min-h-20 bg-gray-50 rounded-lg">
                                        {invitation.book_image_url ? (
                                            <Image
                                                src={invitation.book_image_url}
                                                alt={invitation.book_name}
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
                                    onClick={() => { declineInvitation(invitation.id) }}
                                    text="Decline"
                                />
                                <PrimaryButton
                                    onClick={() => { acceptInvitation(invitation.id, invitation.book_id, invitation.can_edit,) }}
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