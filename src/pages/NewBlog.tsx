import React, { useState, memo, useContext, useRef } from "react";
import CheckAuthentication from "./../HOCs/CheckAuthentication";
import Button from "../components/Button";

import UploadImage from "../components/UploadImage";
import { auth, db } from "../firebase-config";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { Blog } from "../TYPES";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Context";
import openPortal from "../components/Modal";

function NewBlog() {
	const [imageLink, setImageLink] = useState("");
	const title = useRef() as React.MutableRefObject<HTMLTextAreaElement>;
	const body = useRef() as React.MutableRefObject<HTMLTextAreaElement>;
	const navigate = useNavigate();
	const { newError, openModal } = useContext(AppContext);

	const id = `${Math.random().toString(32).substring(2, 12)}`;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!title.current || !body.current) return;

		if (!imageLink) {
			openModal(
				"Image is required",
				<p className="text-gray-500">
					You must upload an image for your blog
				</p>
			);

			return;
		}

		if (!title.current.value || !body.current.value) {
			openModal(
				"Title and text are required",
				<p className="text-gray-500">
					You must write a title and the article body
				</p>
			);

			return;
		}

		const blog: Blog = {
			id,
			title: title.current.value.toString(),
			body: body.current.value.toString(),
			image: imageLink,
			autherId: auth.currentUser?.uid,
			blogInfo: {
				createdAt: serverTimestamp(),
				readsCount: 0,
				likesCount: 0,
				sharesCount: 0,
				commentsCount: 0,
			},
		};

		try {
			const docRef = doc(db, "blogs", id);
			await setDoc(docRef, blog);

			navigate(`/blog/${id}`);
			// notification
		} catch (error) {
			newError(error);
		}
	};

	return (
		<CheckAuthentication>
			<main className="flex min-h-full">
				<form
					className="container flex min-h-full flex-auto flex-col space-y-2 py-4"
					onSubmit={handleSubmit}
				>
					<textarea
						required={true}
						placeholder="Title"
						ref={title}
						className="min-h-40 h-[calc(1em+2rem)] max-h-[calc(2em+2rem)] w-full resize-none overflow-auto rounded border border-dashed border-slate-400/50 bg-transparent p-4 text-center text-5xl font-bold focus:ring-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-slate-400/50 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary-500"
						onInput={(element) => {
							element.currentTarget.style.height = `${element.currentTarget.scrollHeight}px`;
						}}
					></textarea>

					<UploadImage id={id} setImageLink={setImageLink} />

					<textarea
						required={true}
						placeholder="Write here"
						ref={body}
						className="h-auto min-h-[40vh] w-full flex-auto resize-none rounded border border-dashed border-slate-400/50 bg-transparent p-4 text-xl focus:ring-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-slate-400/50 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary-500"
						onInput={(el) => {
							el.currentTarget.style.height = "auto";
							el.currentTarget.style.height = `${el.currentTarget.scrollHeight}px`;
						}}
					></textarea>
					<Button variant="primary" className="w-full" type="submit">
						Publish the blog
					</Button>
				</form>
			</main>
		</CheckAuthentication>
	);
}

export default memo(NewBlog);