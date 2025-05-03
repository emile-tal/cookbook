import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";

import PrimaryButton from "../ui/buttons/primary-button";
import SecondaryButton from "../ui/buttons/secondary-button";
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
                <SecondaryButton text="Cancel" onClick={onClose} />
                <PrimaryButton text="Create Book" onClick={() => createRecipeBook(recipeBookName)} type="button" />
            </DialogActions>
        </Dialog>
    )
}