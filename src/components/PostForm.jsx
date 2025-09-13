// for submitting new posts
import React, { useState } from 'react';
import api from '../services/api';

const PostForm = ({ onPostCreated, socket }) => {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
  const res = await api.post('/api/posts', { content });
      setContent('');
      onPostCreated(res.data);
      socket.emit('createPost', res.data); // Notify server
    } catch (err) {
      alert('Error creating post');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-[#18181b] rounded-2xl shadow-xl border border-[#37beb0]/40 flex flex-col gap-4">
      <textarea
        className="w-full p-3 bg-black text-white border-2 border-[#37beb0]/40 rounded-xl focus:border-[#37beb0] transition placeholder:text-[#37beb0]/70 resize-none min-h-[80px]"
        value={content}
        onChange={e => setContent(e.target.value)}
        placeholder="What's on your mind?"
        required
      />
      <button
        type="submit"
        className="w-full py-3 bg-[#37beb0] text-black font-semibold rounded-xl shadow-md hover:bg-[#2ea99e] transition disabled:opacity-60 disabled:cursor-not-allowed"
        disabled={loading}
      >
        {loading ? 'Posting...' : 'Post'}
      </button>
    </form>
  )
}
export default PostForm;