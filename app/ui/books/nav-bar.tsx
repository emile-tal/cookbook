'use client'

import { IconButton, ToggleButton, ToggleButtonGroup, Tooltip } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';

import AddIcon from '@mui/icons-material/Add';
import { BackButton } from '../back-button';
import GridViewIcon from '@mui/icons-material/GridView';
import NewBookDialog from '@/app/components/NewBookDialog';
import ViewListIcon from '@mui/icons-material/ViewList';
import { createBook } from '@/app/lib/data/recipebooks';
import { useState } from 'react';

interface BookNavBarProps {
    view: "grid" | "list";
    handleViewChange: (event: React.MouseEvent<HTMLElement>, newView: "grid" | "list" | null) => void;
    canEdit: boolean;
}

export function BookNavBar({ view, handleViewChange, canEdit }: BookNavBarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [openDialog, setOpenDialog] = useState(false);

    const handleAdd = () => {
        const bookId = pathname.match(/\/books\/([^\/]+)$/)?.[1];
        if (bookId) {
            router.push(`/recipe/add?bookId=${bookId}`);
        } else {
            setOpenDialog(true);
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };


    const handleCreateRecipeBook = async (recipeBookName: string) => {
        await createBook(recipeBookName);
        router.refresh();
        handleCloseDialog();
    };

    const showBackButton = pathname.match(/\/books\/[^\/]+$/);
    const showNavBar = !pathname.match(/edit$/);

    return (
        <>
            {showNavBar && (
                <nav className="flex justify-between py-2 items-center">
                    <div className="min-w-[24px] sm:min-w-[34px] lg:min-w-[40px]">
                        {showBackButton && <BackButton />}
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

                        {canEdit && <Tooltip title={pathname.match(/\/books\/[^\/]+$/) ? "New Recipe" : "New Book"}>
                            <IconButton
                                onClick={handleAdd}
                                aria-label={pathname.match(/\/books\/[^\/]+$/) ? "New Recipe" : "New Book"}
                                size="small"
                                sx={{
                                    color: 'var(--primary-color)',
                                }}
                            >
                                <AddIcon />
                            </IconButton>
                        </Tooltip>}
                    </div>
                </nav>
            )}
            <NewBookDialog
                open={openDialog}
                onClose={handleCloseDialog}
                createRecipeBook={handleCreateRecipeBook}
            />
        </>
    );
}