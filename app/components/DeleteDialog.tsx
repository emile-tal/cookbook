import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"

interface DeleteDialogProps {
    open: boolean
    onClose: () => void
    onDelete: () => void
    itemName: string
}

export default function DeleteDialog({ open, onClose, onDelete, itemName }: DeleteDialogProps) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogTitle>Delete {itemName}</DialogTitle>
            <DialogContent>
                <p className="text-sm text-gray-500 mb-4">Are you sure you want to delete this {itemName.toLowerCase()}? This action cannot be undone.</p>
                <DialogActions>
                    <button className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-opacity-90" onClick={onClose}>Cancel</button>
                    <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90" onClick={onDelete}>Delete</button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    )
}