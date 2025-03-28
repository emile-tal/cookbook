'use client'

import CheckIcon from '@mui/icons-material/Check';
import EditIcon from '@mui/icons-material/Edit';
import { updateUsername } from '@/app/lib/action';
import { useState } from 'react';

export default function EditUsername({ username, userId }: { username: string, userId: string }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedUsername, setEditedUsername] = useState(username);
    const [updatedUsername, setUpdatedUsername] = useState(username);

    const handleSave = async () => {
        const result = await updateUsername(userId, editedUsername);
        if (result.success) {
            setIsEditing(false);
            setUpdatedUsername(editedUsername);
        }
    }

    return (
        <div>
            {isEditing ? (
                <div className="flex gap-2">
                    <input type="text" value={editedUsername} onChange={(e) => setEditedUsername(e.target.value)} />
                    <button onClick={handleSave}>
                        <CheckIcon className="w-4 h-4" />
                    </button>
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