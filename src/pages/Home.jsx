import React, { useState, useEffect } from "react";
import PostForm from "../components/PostForm";
import api from "../services/api";
import { io } from "socket.io-client";
import LikeButton from "../components/LikeButton";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";

const socket = io(process.env.REACT_APP_API_URL);

const Home = () => {

  const [posts, setPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/posts').then(res => {
      setPosts(res.data.posts || []);
    });
    socket.on('newPost', post => {
      setPosts(prev => prev.some(p => p._id === post._id) ? prev : [post, ...prev]);
    });
    return () => socket.off('newPost');
  }, []);

  
  const handlePostCreated = (post) => {
    setPosts(prev => prev.some(p => p._id === post._id) ? prev : [post, ...prev]);
  };

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <main className="flex-1 flex flex-col items-center justify-start w-full">
        <header className="w-full max-w-4xl px-4 mt-10 mb-8 text-center flex flex-col items-center">
          <h1 className="text-5xl font-black mb-4 bg-gradient-to-r from-[#37beb0] via-[#1a6262] to-[#37beb0] text-transparent bg-clip-text drop-shadow-lg tracking-tight font-sans">Anonymous Wall</h1>
          <p className="text-xl text-[#37beb0] mb-2 max-w-2xl font-sans font-normal">
            Share your thoughts, ideas, and confessions <span className="font-bold">anonymously</span>.<br />
            Connect, react, and comment without revealing your identity.<br />
            <span className="text-[#2ea99e] font-semibold">A safe space for open expression.</span>
          </p>
        </header>
        <div className="w-full max-w-xl mb-10 px-4">
          <PostForm onPostCreated={handlePostCreated} socket={socket} />
        </div>
        <ul className="w-full max-w-4xl px-4 space-y-8 pb-10">
          {(Array.isArray(posts) ? posts : []).map(post => (
            <li
              key={post._id}
              className="bg-[#18181b] border border-[#37beb0]/40 rounded-2xl shadow-2xl p-6 transition hover:scale-[1.01] hover:border-[#37beb0] flex flex-col gap-2 w-full cursor-pointer"
              onClick={() => navigate(`/post/${post._id}`)}
            >
              <div className="flex items-start gap-4">
                <span className="avatar flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-[#37beb0] to-[#1a6262] text-black text-xl font-bold shadow-lg border-2 border-[#37beb0] shrink-0">
                  {post.content.charAt(0).toUpperCase()}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <time dateTime={post.createdAt} className="text-xs text-[#37beb0]/70 mb-1">{new Date(post.createdAt).toLocaleString()}</time>
                    <span onClick={e => e.stopPropagation()}>
                      <LikeButton
                        postId={post._id}
                        likesCount={post.likesCount || 0}
                        likedBy={post.likedBy || []}
                      />
                    </span>
                  </div>
                  <div className="mt-2 text-left">
                    <h2 className="text-lg font-medium text-[#37beb0] break-words whitespace-pre-line overflow-hidden text-left">{post.content}</h2>
                  </div>
                </div>
              </div>
              {/* CommentSection removed. Comments will be shown on the post details page. */}
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </div>
  );
}
export default Home;