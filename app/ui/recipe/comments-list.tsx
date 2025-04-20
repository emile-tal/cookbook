'use client'

import { Comment } from '@/app/types/definitions'

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
                <div key={comment.id} className="border-t border-gray-200 pt-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="font-bold">{comment.username}</span>
                        <p className="text-sm text-gray-500">
                            {new Date(comment.created_at).toLocaleDateString()}
                        </p>
                    </div>
                    <p className="text-gray-700">{comment.comment}</p>
                </div>
            ))}
        </div>
    )
} 