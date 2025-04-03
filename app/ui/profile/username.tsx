'use client'

import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import { changeUsername } from '@/app/actions/auth';
import { useState } from 'react';
export default function EditUsername({ username }: { username: string }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedUsername, setEditedUsername] = useState(username);
    const [updatedUsername, setUpdatedUsername] = useState(username);

    const handleSave = async () => {
        const result = await changeUsername(editedUsername);
        if (result.success) {
            setIsEditing(false);
            setUpdatedUsername(editedUsername);
        }
    }

    return (
        <div>
            {isEditing ? (
                <div className="flex gap-2">
                    <input type="text" value={editedUsername} onChange={(e) => setEditedUsername(e.target.value)} className="rounded-md p-2" />
                    <div className="flex gap-2">
                        <button onClick={handleSave}>
                            <CheckIcon className="w-4 h-4" />
                        </button>
                        <button onClick={() => setIsEditing(false)}>
                            <CloseIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="flex gap-2">
                    <h1 className="text-2xl font-bold">{updatedUsername}</h1>
                    <button onClick={() => setIsEditing(true)}>
                        <EditIcon className="w-4 h-4" />
                    </button>
                </div>
            )}
        </div>
    )
}