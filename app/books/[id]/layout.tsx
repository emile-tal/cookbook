import ClientBookLayout from "./client-layout";
import { getCurrentUser } from "@/app/lib/auth";
import { userCanEditBook } from "@/app/lib/data/permissions";

export default async function BookLayout({ children, params }: { children: React.ReactNode, params: Promise<{ id: string }> }) {
    const { id } = await params;
    const user = await getCurrentUser();

    const canEdit = user && id ? await userCanEditBook(id, user.id) : false;

    return (
        <div>
            <ClientBookLayout canEdit={canEdit}>
                {children}
            </ClientBookLayout>
        </div>
    );
}