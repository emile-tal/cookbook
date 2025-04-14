'use client'

import { Comment } from '@/app/types/definitions'
import PersonIcon from '@mui/icons-material/Person'

export default function CommentsList({ comments }: { comments: Comment[] }) {
    if (comments.length === 0) {
        return (
            <div className="text-center py-8">
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {comments.map((comment) => (
                <div key={comment.id} className="border-b border-gray-200 pb-4">
                    <div className="flex items-center gap-2 mb-2">
                        {comment.user_image_url ? (
                            <img
                                src={comment.user_image_url}
                                alt={comment.username}
                                className="w-8 h-8 rounded-full"
                            />
                        ) : (
                            <PersonIcon className="w-8 h-8" />
                        )}
                        <span className="font-medium">{comment.username}</span>
                    </div>
                    <p className="text-gray-700">{comment.comment}</p>
                    <p className="text-sm text-gray-500 mt-2">
                        {new Date(comment.created_at).toLocaleDateString()}
                    </p>
                </div>
            ))}
        </div>
    )
} 