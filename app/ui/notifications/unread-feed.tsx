import Image from "next/image"
import { Invitation } from "@/app/types/definitions"
import MenuBookIcon from '@mui/icons-material/MenuBook'

export default function UnreadFeed({ invitations }: { invitations: Invitation[] }) {
    return (
        <div className="flex flex-col gap-4">
            {invitations.map((invitation) => (
                <div key={invitation.id} className="bg-white p-5 rounded-xl shadow-md border border-gray-100">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0 w-12 h-12 relative rounded-full overflow-hidden bg-gray-100">
                            {invitation.sender_image_url ? (
                                <Image
                                    src={invitation.sender_image_url}
                                    alt={invitation.sender_username}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-primary/10 text-primary">
                                    {invitation.sender_username?.[0]?.toUpperCase() || '?'}
                                </div>
                            )}
                        </div>

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
                                <div className="flex gap-4 flex-col">
                                    <h4 className="text-lg font-semibold text-primary">{invitation.book_name}</h4>
                                    <div className="min-w-20 min-h-20 relative bg-gray-50 rounded-lg flex-shrink-0">
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
                                </div>
                                {invitation.message && (
                                    <p className="text-sm text-gray-600 italic bg-gray-50 p-2 rounded-md flex-1 flex items-center">
                                        "{invitation.message}"
                                    </p>
                                )}
                            </div>

                            <div className="mt-4 flex gap-3 justify-end">
                                <button className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
                                    Decline
                                </button>
                                <button className="px-4 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition-colors">
                                    Accept
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}