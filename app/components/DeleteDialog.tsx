import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"

import PrimaryButton from "../ui/buttons/primary-button"
import SecondaryButton from "../ui/buttons/secondary-button"

interface DeleteDialogProps {
    open: boolean
    onClose: () => void
    onDelete: () => void
    itemName: string
}

export default function DeleteDialog({ open, onClose, onDelete, itemName }: DeleteDialogProps) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle className="text-primary">Delete {itemName}</DialogTitle>
            <DialogContent>
                <p className="text-sm text-gray-500 mb-4">Are you sure you want to delete this {itemName.toLowerCase()}? This action cannot be undone.</p>
                <DialogActions>
                    <SecondaryButton text="Cancel" onClick={onClose} />
                    <PrimaryButton text="Delete" onClick={onDelete} type="button" />
                </DialogActions>
            </DialogContent>
        </Dialog>
    )
}