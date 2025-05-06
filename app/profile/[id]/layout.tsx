import { BookFilterProvider } from "@/app/context/book-filter-context";
import { BookRecipeProvider } from "../../context/book-recipe-context";
import { DisplayViewProvider } from "../../context/display-view-context";
import ProfileAsideWrapper from "@/app/ui/profile/profile-aside-wrapper";
import ProfileStateInitializer from "@/app/ui/profile/profile-state-initializer";
import { RecipeFilterProvider } from "@/app/context/recipe-filter-context";

interface ProfileLayoutProps {
    children: React.ReactNode;
    params: Promise<{ id: string }>;
}

export default async function ProfileLayout({ children, params }: ProfileLayoutProps) {
    const { id } = await params;

    return (
        <BookRecipeProvider>
            <DisplayViewProvider>
                <BookFilterProvider>
                    <RecipeFilterProvider>
                        <ProfileStateInitializer />
                        <div className="container-spacing mb-8">
                            <main className="flex flex-col gap-8 sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                                <ProfileAsideWrapper id={id} />
                                {children}
                            </main>
                        </div>
                    </RecipeFilterProvider>
                </BookFilterProvider>
            </DisplayViewProvider>
        </BookRecipeProvider>
    );
} 