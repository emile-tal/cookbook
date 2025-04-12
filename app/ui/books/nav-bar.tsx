'use client'

import { Dialog, DialogActions, DialogContent, DialogTitle, IconButton, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import AddIcon from '@mui/icons-material/Add';
import { BackButton } from '../back-button';
import GridViewIcon from '@mui/icons-material/GridView';
import ViewListIcon from '@mui/icons-material/ViewList';
import { createBook } from '@/app/lib/data/recipebooks/recipebook';

interface BookNavBarProps {
    view: "grid" | "list";
    handleViewChange: (event: React.MouseEvent<HTMLElement>, newView: "grid" | "list" | null) => void;
}

export function BookNavBar({ view, handleViewChange }: BookNavBarProps) {
    const router = useRouter();
    const pathname = usePathname();
    const [openDialog, setOpenDialog] = useState(false);
    const [recipeBookName, setRecipeBookName] = useState('');

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

    const handleCreateRecipeBook = async () => {
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

                        <IconButton
                            onClick={handleAdd}
                            aria-label="add recipe"
                            size="small"
                            sx={{
                                color: 'var(--primary-color)',
                            }}
                        >
                            <AddIcon />
                        </IconButton>
                    </div>
                </nav>
            )}

            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                slotProps={{
                    paper: {
                        className: "rounded-xl p-2 bg-gray-50 w-[400px]"
                    }
                }}
            >
                <DialogTitle className="text-primary">Create New Recipe Book</DialogTitle>
                <DialogContent>
                    <input
                        type="text"
                        placeholder="Recipe Name"
                        className="min-w-full p-2 rounded-md border border-gray-300"
                        value={recipeBookName}
                        onChange={(e) => setRecipeBookName(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <button
                        onClick={handleCloseDialog}
                        className="px-4 py-2 text-primary hover:bg-primary/5 rounded-md transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleCreateRecipeBook}
                        className="px-4 py-2 bg-primary text-white hover:bg-primary/80 rounded-md transition-colors"
                    >
                        Create Book
                    </button>
                </DialogActions>
            </Dialog>
        </>
    );
}