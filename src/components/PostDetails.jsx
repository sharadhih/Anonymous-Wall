//to display all posts
import React, { useEffect, useState} from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import { io } from "socket.io-client";
import CommentSection from "./CommentSection";

const socket = io(import.meta.env.VITE_REACT_APP_API_URL);

const PostDetails = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);

    useEffect(() => {
        const fetchPost = async () => {
            const res = await api.get(`/api/posts/${id}`);
            setPost(res.data);
        };

        const fetchComments = async () => {
            const res = await api.get(`/api/posts/${id}/comments`);
            setComments(res.data);
        };

        fetchPost();
        fetchComments();

        const handleNewComment = (comment) => {
            if (comment.postId === id) {
                setComments(prev => [...prev, comment]);
            }
        };

        socket.on('newComment', handleNewComment);

        return () => {
            socket.off('newComment', handleNewComment);
        };
    }, [id]);
    
    return (
        <div className="min-h-screen w-full flex flex-col items-center justify-center bg-black px-4 py-10">
            {post ? (
                <div className="w-full max-w-2xl bg-[#18181b] border border-[#37beb0]/40 rounded-2xl shadow-2xl p-8 mb-6">
                    <h2 className="text-2xl font-bold text-[#37beb0] mb-2">{post.content}</h2>
                    <CommentSection postId={id} comments={comments} socket={socket} />
                </div>
            ) : (
                <p className="text-white">Loading post...</p>
            )}
        </div>
    );
};   

export default PostDetails;