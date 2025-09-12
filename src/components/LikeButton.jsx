
import React, { useState, useEffect } from "react";
import api from "../services/api";

const HeartIcon = ({ filled }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={filled ? "#37beb0" : "none"}
    stroke={filled ? "#37beb0" : "#888"}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`w-6 h-6 transition-all duration-200 ${filled ? 'scale-110' : 'scale-100'}`}
  >
    <path
      d="M12 21C12 21 4 13.36 4 8.5C4 5.42 6.42 3 9.5 3C11.24 3 12.91 4.1 13.44 5.68C13.97 4.1 15.64 3 17.38 3C20.46 3 22.88 5.42 22.88 8.5C22.88 13.36 15.88 21 12 21Z"
      stroke={filled ? "#37beb0" : "#888"}
      fill={filled ? "#37beb0" : "none"}
    />
  </svg>
);

const LikeButton = ({ postId, likesCount = 0, likedBy = [], onLike }) => {
  const [likes, setLikes] = useState(likesCount);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const clientId = localStorage.getItem('clientId') || Math.random().toString(36).slice(2);
    localStorage.setItem('clientId', clientId);
    setLiked(Array.isArray(likedBy) && likedBy.includes(clientId));
    setLikes(likesCount);
  }, [likesCount, likedBy]);

  const handleLike = async (e) => {
    if (e) e.stopPropagation();
    setLoading(true);
    try {
      const clientId = localStorage.getItem('clientId');
      const res = await api.patch(
        `/posts/${postId}/like`,
        {},
        { headers: { 'x-client-id': clientId } }
      );
      setLikes(res.data.likesCount);
      setLiked(res.data.liked);
      if (onLike) onLike(res.data.liked, res.data.likesCount);
    } catch (err) {
      alert("Error liking post");
    }
    setLoading(false);
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className={`flex items-center gap-2 px-3 py-2 rounded-full font-semibold transition-all duration-200 shadow border border-[#37beb0]/40 focus:outline-none focus:ring-2 focus:ring-[#37beb0] mr-2
        ${liked ? 'bg-[#18181b] text-[#37beb0] hover:bg-[#232323]' : 'bg-[#18181b] text-[#888] hover:bg-[#232323]'}
        disabled:opacity-60 disabled:cursor-not-allowed`}
    >
      <HeartIcon filled={liked} />
      <span className="text-base">{likes}</span>
    </button>
  );
};

export default LikeButton;
