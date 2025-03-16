import { IconButton, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';

import AddIcon from '@mui/icons-material/Add';
import GridViewIcon from '@mui/icons-material/GridView';
import SettingsIcon from '@mui/icons-material/Settings';
import ViewListIcon from '@mui/icons-material/ViewList';

interface BookNavBarProps {
    view: "grid" | "list";
    handleViewChange: (event: React.MouseEvent<HTMLElement>, newView: "grid" | "list" | null) => void;
}

export function BookNavBar({ view, handleViewChange }: BookNavBarProps) {
    const router = useRouter();
    const pathname = usePathname();

    const handleAddRecipe = () => {
        // Extract book ID from the pathname if we're on a book detail page
        const bookId = pathname.match(/\/books\/([^\/]+)$/)?.[1];
        if (bookId) {
            // Navigate to add recipe page, later we can add logic to associate with the book
            router.push(`/recipe/add?bookId=${bookId}`);
        }
    };

    // Only show add button if we're on a specific book page
    const showAddButton = pathname.match(/\/books\/[^\/]+$/);

    return (
        <nav className="flex justify-end py-2 items-center">
            <div className="flex items-center gap-2">
                <ToggleButtonGroup
                    value={view}
                    exclusive
                    onChange={handleViewChange}
                    aria-label="view toggle"
                    sx={{
                        border: 'none',
                        '& .MuiButtonBase-root': {
                            border: 'none',
                        },
                    }}
                >
                    <ToggleButton value="grid" aria-label="grid view">
                        <GridViewIcon />
                    </ToggleButton>
                    <ToggleButton value="list" aria-label="list view">
                        <ViewListIcon />
                    </ToggleButton>
                </ToggleButtonGroup>

                {showAddButton && (
                    <IconButton
                        onClick={handleAddRecipe}
                        aria-label="add recipe"
                        size="small"
                        sx={{
                            color: 'var(--primary-color)',
                        }}
                    >
                        <AddIcon />
                    </IconButton>
                )}

                <SettingsIcon />
            </div>
        </nav>
    );
}