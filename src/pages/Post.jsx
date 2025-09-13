
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import CommentSection from "../components/CommentSection";
import Footer from "../components/Footer";
import { io } from "socket.io-client";
const socket = io(import.meta.env.VITE_REACT_APP_API_URL);

const Post = () => {
	const { id } = useParams();
	const navigate = useNavigate();
	const [post, setPost] = useState(null);
	const [comments, setComments] = useState([]);

		useEffect(() => {
			const fetchPost = async () => {
				try {
					const res = await api.get(`/api/posts/${id}`);
					setPost(res.data.post || res.data);
				} catch (err) {
					setPost(null);
				}
			};
			const fetchComments = async () => {
				try {
					const res = await api.get(`/api/posts/${id}/comments`);
					setComments(res.data);
				} catch (err) {
					setComments([]);
				}
			};
			fetchPost();
			fetchComments();
		}, [id]);

				return (
					<div className="min-h-screen flex flex-col bg-black">
						<main className="flex-1 flex flex-col items-center justify-start w-full">
							<div className="w-full max-w-4xl flex flex-col items-center mt-10 mb-10 px-4">
								<button
									onClick={() => navigate("/")}
									className="mb-8 px-5 py-2 bg-[#18181b] text-[#37beb0] border border-[#37beb0]/40 rounded-full font-semibold shadow hover:bg-[#232323] hover:text-[#2ea99e] transition flex items-center gap-2"
								>
									<span className="text-xl">←</span> <span>Back to Home</span>
								</button>
								<div className="w-full bg-[#18181b] border border-[#37beb0]/40 rounded-2xl shadow-2xl p-6 flex flex-col gap-2">
									{post ? (
										<>
											<div className="flex items-start gap-4">
												<span className="avatar flex items-center justify-center w-12 h-12 rounded-full bg-gradient-to-tr from-[#37beb0] to-[#1a6262] text-black text-xl font-bold shadow-lg border-2 border-[#37beb0] shrink-0">
													{post.content.charAt(0).toUpperCase()}
												</span>
												<div className="flex-1 min-w-0">
													<div className="flex items-center justify-between">
														<time dateTime={post.createdAt} className="text-xs text-[#37beb0]/70 mb-1">{new Date(post.createdAt).toLocaleString()}</time>
													</div>
													<div className="mt-2 text-left">
														<h2 className="text-lg font-medium text-[#37beb0] break-words whitespace-pre-line overflow-hidden text-left">{post.content}</h2>
													</div>
												</div>
											</div>
											<div className="mt-2">
												<CommentSection postId={id} comments={comments} socket={socket} />
											</div>
										</>
									) : (
										<p className="text-white">Post not found or has been deleted.</p>
									)}
								</div>
							</div>
						</main>
						<Footer />
					</div>
				);
};

export default Post;
