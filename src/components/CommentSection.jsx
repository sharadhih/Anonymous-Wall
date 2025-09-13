
import React, { useState, useEffect } from "react";
import api from "../services/api";

const CommentSection = ({ postId, socket }) => {
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [comments, setComments] = useState([]);
    const [sortOrder, setSortOrder] = useState("newest"); // 'newest' or 'oldest'

    // Fetch comments on mount and when postId changes
    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await api.get(`/api/posts/${postId}/comments`);
                setComments(Array.isArray(res.data.comments) ? res.data.comments : []);
            } catch (err) {
                setComments([]);
            }
        };
        fetchComments();

        // Listen for new comments via socket
        if (socket) {
            const handleNewComment = (comment) => {
                if (comment.postId === postId) {
                    setComments(prev => {
                        if (prev.some(c => c._id === comment._id)) return prev;
                        return [...prev, comment];
                    });
                }
            };
            socket.on('newComment', handleNewComment);
            return () => socket.off('newComment', handleNewComment);
        }
    }, [postId, socket]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await api.post(`/api/posts/${postId}/comments`, { content });
            setContent("");
            // Add the new comment locally
            setComments(prev => [...prev, res.data]);
            // Notify via socket
            if (socket) socket.emit('createComment', { ...res.data, postId });
        } catch (err) {
            alert("Error posting comment");
        }
        setLoading(false);
    };

    // Sort comments based on sortOrder
    const sortedComments = Array.isArray(comments)
        ? sortOrder === "newest"
            ? [...comments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
            : [...comments].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
        : [];

    return (
        <div className="mt-4">
            <form onSubmit={handleSubmit} className="mb-5 flex flex-col gap-2 bg-[#18181b] border border-[#37beb0]/30 rounded-xl p-4 shadow">
                <label className="text-[#37beb0] font-semibold mb-1 text-base" htmlFor="comment-input">Add a comment</label>
                <textarea
                    id="comment-input"
                    className="w-full p-2 bg-[#232323] text-white border border-[#37beb0]/30 rounded-lg focus:border-[#37beb0] transition placeholder:text-[#37beb0]/70 resize-none min-h-[40px] text-sm"
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    placeholder="Share your thoughts..."
                    required
                />
                <button
                    type="submit"
                    className="self-end px-4 py-1 bg-[#37beb0] text-black font-semibold rounded-lg shadow hover:bg-[#2ea99e] transition disabled:opacity-60 disabled:cursor-not-allowed text-sm"
                    disabled={loading}
                >
                    {loading ? "Posting..." : "Comment"}
                </button>
            </form>
            <div className="flex items-center justify-end mb-2">
                <button
                    type="button"
                    className={`px-4 py-1 rounded-full text-sm font-semibold border border-[#37beb0]/40 bg-[#232323] text-[#37beb0] hover:bg-[#18181b] transition mr-2 ${sortOrder === "newest" ? "bg-[#37beb0] text-black" : ""}`}
                    onClick={() => setSortOrder("newest")}
                >
                    Newest
                </button>
                <button
                    type="button"
                    className={`px-4 py-1 rounded-full text-sm font-semibold border border-[#37beb0]/40 bg-[#232323] text-[#37beb0] hover:bg-[#18181b] transition ${sortOrder === "oldest" ? "bg-[#37beb0] text-black" : ""}`}
                    onClick={() => setSortOrder("oldest")}
                >
                    Oldest
                </button>
            </div>
            <ul className="flex flex-col gap-2">
                {sortedComments.map(comment => (
                    <li
                        key={comment._id}
                        className="flex items-start gap-2 bg-[#232323] border border-[#37beb0]/10 rounded-lg px-3 py-2 shadow hover:shadow-lg hover:border-[#37beb0]/40 transition"
                    >
                        <span className="flex items-center justify-center w-7 h-7 rounded-full bg-gradient-to-tr from-[#37beb0] to-[#1a6262] text-black text-sm font-bold shadow border border-[#37beb0] mt-1">
                            {comment.content?.charAt(0)?.toUpperCase() || "C"}
                        </span>
                        <div className="flex-1">
                            <div className="text-white text-sm break-words whitespace-pre-line mb-0.5">{comment.content}</div>
                            <div className="text-xs text-[#37beb0]/70">{comment.createdAt ? new Date(comment.createdAt).toLocaleString() : ""}</div>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default CommentSection;
