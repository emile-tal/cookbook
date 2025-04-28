import { Dialog, DialogContent } from "@mui/material"

import LoginForm from "@/app/ui/login/login-form"

interface LoginDialogProps {
    open: boolean
    onClose: () => void
    from?: string
}

export default function LoginDialog({ open, onClose, from }: LoginDialogProps) {
    return (
        <Dialog open={open} onClose={onClose}>
            <DialogContent>
                <div className="p-2 md:p-8">
                    <LoginForm from={from} />
                </div>
            </DialogContent>
        </Dialog>
    )
}