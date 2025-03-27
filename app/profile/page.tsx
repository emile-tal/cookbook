import EditUsername from "../ui/profile/edit-username";
import { getUser } from "../lib/data";

export default async function Page() {
    const user = await getUser('410544b2-4001-4271-9855-fec4b6a6442a');

    if (!user) {
        return <div>User not found</div>
    }

    return (
        <main className="container-spacing">
            <div className="flex gap-8">
                <div>{/* User avatar */}</div>
                <EditUsername username={user.username} userId={user.id} />
            </div>
        </main>
    )
}