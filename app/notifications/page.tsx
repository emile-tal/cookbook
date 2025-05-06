import Link from "next/link"
import UnreadFeed from "../ui/notifications/unread-feed"
import { fetchPendingBookInvitationsByUser } from "../lib/data/recipebookinvitations"
import { fetchPendingRecipeInvitationsByUser } from "../lib/data/recipeinvitations"
import { getCurrentUser } from "../lib/auth"
import { redirect } from "next/navigation"

export default async function Notifications() {
    const pendingBookInvitations = await fetchPendingBookInvitationsByUser()
    const pendingRecipeInvitations = await fetchPendingRecipeInvitationsByUser()
    const user = await getCurrentUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <main className="container-spacing mb-8">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-2xl font-bold mb-6">Pending Invitations</h2>
                {(pendingBookInvitations && pendingBookInvitations.length > 0) || (pendingRecipeInvitations && pendingRecipeInvitations.length > 0) ? (
                    <UnreadFeed bookInvitations={pendingBookInvitations || []} recipeInvitations={pendingRecipeInvitations || []} />
                ) : (
                    <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100 text-center">
                        <div className="flex flex-col items-center gap-4">
                            <h3 className="text-lg font-medium text-gray-700">No invitations</h3>
                            <p className="text-gray-500 px-8">
                                {"You don't have any pending invitations. When someone invites you to collaborate on a cookbook, it will appear here."}
                            </p>
                            <Link href="/" className="mt-2 text-primary hover:underline">
                                Return to home
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}