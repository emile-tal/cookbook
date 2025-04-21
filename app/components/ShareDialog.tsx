'use client'

import { Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material"

import { useState } from "react"

interface ShareDialogProps {
    open: boolean
    onClose: () => void
    onShare: (email: string, message: string, permission: string) => void
    bookName: string
}

export default function ShareDialog({ open, onClose, onShare, bookName }: ShareDialogProps) {
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [permission, setPermission] = useState<'editor' | 'viewer'>('editor')
    const [error, setError] = useState<string[]>([])

    const validateShare = () => {
        if (email.length === 0) {
            setError([...error, 'email'])
        } else {
            onShare(email, message, permission)
        }
    }

    return (
        <Dialog
            open={open}
            onClose={onClose}
            slotProps={{
                paper: {
                    style: {
                        width: '400px',
                        maxWidth: '100%'
                    }
                }
            }}
        >
            <DialogTitle className="text-primary">{`Share "${bookName}"`}</DialogTitle>
            <DialogContent>
                <div className="flex flex-col gap-4 py-2">
                    <div className="flex justify-between min-w-full">
                        <input
                            type="text"
                            placeholder="Enter email address"
                            className={`w-[240px] px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 ${error.includes('email') ? 'border-red-500' : ''}`}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <select className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50"
                            value={permission}
                            onChange={(e) => {
                                setPermission(e.target.value as 'editor' | 'viewer')
                            }}
                        >
                            <option value="editor">Editor</option>
                            <option value="viewer">Viewer</option>
                        </select>
                    </div>
                    <textarea
                        className={`min-w-full h-24 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none ${message.length > 200 ? 'border-red-500' : ''}`}
                        placeholder="Add a message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </div>
                <div className="flex justify-end">
                    <span className={`text-sm ${message.length > 200 ? 'text-red-500' : 'text-gray-500'}`}>
                        {message.length} / 200 characters
                    </span>
                </div>
                <DialogActions className="px-0 pb-2">
                    <button className="bg-gray-400 text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors" onClick={onClose}>Cancel</button>
                    <button className="bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors" onClick={validateShare}>Share</button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    )
}