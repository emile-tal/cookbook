'use client'

import { Comment } from '@/app/types/definitions'

export default function CommentsList({ comments }: { comments: Comment[] }) {
    if (comments.length === 0) {
        return (
            <div className="text-center py-8">
                <p className="text-gray-500">No comments yet. Be the first to comment!</p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {comments.map((comment) => (
                <div key={comment.id} className="border-b border-gray-200 pb-4">
                    <div className="flex items-center gap-2 mb-2">
                        <img
                            src={comment.user_image_url || '/default-avatar.png'}
                            alt={comment.username}
                            className="w-8 h-8 rounded-full"
                        />
                        <span className="font-medium">{comment.username}</span>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                    <p className="text-sm text-gray-500 mt-2">
                        {new Date(comment.created_at).toLocaleDateString()}
                    </p>
                </div>
            ))}
        </div>
    )
} 