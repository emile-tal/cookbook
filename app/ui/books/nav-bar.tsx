'use client'

import { IconButton, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';

import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GridViewIcon from '@mui/icons-material/GridView';
import { SearchBar } from '@/app/components/SearchBar';
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
        const bookId = pathname.match(/\/books\/([^\/]+)$/)?.[1];
        if (bookId) {
            router.push(`/recipe/add?bookId=${bookId}`);
        }
    };

    const handleBack = () => {
        router.push('/books');
    };

    const showBackButton = pathname.match(/\/books\/[^\/]+$/);

    return (
        <nav className="flex justify-between py-2 items-center">
            <div className="min-w-[24px] sm:min-w-[34px] lg:min-w-[40px]">
                {showBackButton && <IconButton
                    onClick={handleBack}
                    aria-label="go back"
                    size="small"
                    sx={{
                        color: 'var(--primary-color)',
                    }}
                >
                    <ArrowBackIcon />
                </IconButton>}
            </div>

            <div className="flex-1 min-w-[300px] max-w-[500px] mx-2">
                <SearchBar placeholder="Search..." />
            </div>

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

                <SettingsIcon />
            </div>
        </nav>
    );
}