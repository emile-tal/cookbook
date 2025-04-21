import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

import { useState } from "react";

interface NewBookDialogProps {
    open: boolean
    onClose: () => void
    createRecipeBook: (recipeBookName: string) => void
}

export default function NewBookDialog({ open, onClose, createRecipeBook }: NewBookDialogProps) {
    const [recipeBookName, setRecipeBookName] = useState('');


    return (
        <Dialog
            open={open}
            onClose={onClose}
            slotProps={{
                paper: {
                    className: "rounded-xl p-2 bg-gray-50 w-[400px]"
                }
            }}
        >
            <DialogTitle className="text-primary">Create New Book</DialogTitle>
            <DialogContent>
                <input
                    type="text"
                    placeholder="Book Name"
                    className="min-w-full p-2 rounded-md border border-gray-300"
                    value={recipeBookName}
                    onChange={(e) => setRecipeBookName(e.target.value)}
                />
            </DialogContent>
            <DialogActions>
                <button
                    onClick={onClose}
                    className="px-4 py-2 text-primary hover:bg-primary/5 rounded-md transition-colors"
                >
                    Cancel
                </button>
                <button
                    onClick={() => createRecipeBook(recipeBookName)}
                    className="px-4 py-2 bg-primary text-white hover:bg-primary/80 rounded-md transition-colors"
                >
                    Create Book
                </button>
            </DialogActions>
        </Dialog>
    )
}