'use client'

import { Comment } from '@/app/types/definitions'

export default function CommentsList({ comments }: { comments: Comment[] }) {
    if (comments.length === 0) {
        return (
            <div className="py-2 md:py-8 text-gray-500">
                No comments yet. Be the first to share your thoughts!
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {comments.map((comment) => (
                <div
                    key={comment.id}
                    className="border-t border-gray-200 pt-4 transition-all duration-200 hover:bg-gray-50 rounded-lg p-4"
                >
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-3">
                        <span className="font-semibold text-gray-900">{comment.username}</span>
                        <p className="text-sm text-gray-500">
                            {new Date(comment.created_at).toLocaleDateString()}
                        </p>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap break-words">{comment.comment}</p>
                </div>
            ))}
        </div>
    )
} 