import { fetchUnreadInvitationsByUser } from "../lib/data/invitations"
import { getCurrentUser } from "../lib/auth"
import { redirect } from "next/navigation"

export default async function Notifications() {
    const invitations = await fetchUnreadInvitationsByUser()
    const user = await getCurrentUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <main className="container-spacing">
            <h2 className="text-2xl font-bold">Unread Invitations</h2>
            {invitations && invitations.length > 0 ? (
                <div>
                    {invitations.map((invitation) => (
                        <div key={invitation.id}>
                            <p>{invitation.sender_id}</p>

                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    <p>No unread invitations</p>
                </div>
            )}
        </main>
    )
}