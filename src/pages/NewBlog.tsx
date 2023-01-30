import React, { useState, memo, useContext, useRef } from "react";
import CheckAuthentication from "./../HOCs/CheckAuthentication";
import Button from "../components/Button";

import UploadImage from "../components/UploadImage";
import { auth, db } from "../firebase-config";
import { doc, setDoc, Timestamp } from "firebase/firestore";
import { Blog } from "../TYPES";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Context";
import MdEditor from "../components/MdEditor";

function NewBlog() {
	const [imageLink, setImageLink] = useState("");
	const title = useRef() as React.MutableRefObject<HTMLTextAreaElement>;
	const navigate = useNavigate();
	const { newError, openModal } = useContext(AppContext);
	const [blogBody, setBlogBody] = useState(
		`# ${title.current?.value || "Title"} \n \n Good writing...`
	);

	const id = `${Math.random().toString(32).substring(2, 12)}`;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!imageLink) {
			openModal(
				"Image is required",
				<p className="text-gray-500">
					You must upload an image for your blog
				</p>
			);

			return;
		}

		if (!title.current.value || !blogBody) {
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
			body: blogBody.toString(),
			image: imageLink,
			authorId: auth.currentUser?.uid,
			blogInfo: {
				createdAt: Timestamp.fromDate(new Date()),
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
				<div className="container flex min-h-full flex-auto flex-col space-y-2 py-4">
					<textarea
						required={true}
						placeholder="Title"
						onChange={(e) => {
							setBlogBody(
								`# ${e.target.value || "Title"} \n \n Good writing...`
							);
						}}
						ref={title}
						className="min-h-40 h-[calc(1em+2rem)] max-h-[calc(2em+2rem)] w-full resize-none overflow-auto rounded border border-dashed border-slate-400/50 bg-transparent p-4 text-center text-5xl font-bold focus:ring-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-slate-400/50 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary-500"
						onInput={(element) => {
							let lineHeight = 16 * 3; // fontSize * lineHeight
							var height = element.currentTarget.scrollHeight; // get the height of the text area
							element.currentTarget.style.height = lineHeight + "px"; // set the height to 3 lines of text
							var numberOfLines = Math.floor(height / lineHeight);
							element.currentTarget.style.height = `${
								numberOfLines * lineHeight + 32 // add 16 + 16px for padding top and bottom
							}px`;
						}}
					></textarea>

					<UploadImage
						path="blogsThumbnails"
						name={id}
						onSuccess={(url) => setImageLink(url)}
					/>

					<MdEditor
						value={blogBody}
						setValue={setBlogBody}
						className="h-auto min-h-[40vh] flex-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-slate-400/50 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary-500"
					/>

					{/* <textarea
						required={true}
						placeholder="Write here"
						ref={body}
						className="h-auto min-h-[50vh] w-full flex-auto resize-none rounded border border-dashed border-slate-400/50 bg-transparent p-4 text-xl focus:ring-0 [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-slate-400/50 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-primary-500"
						onInput={(el) => {
							el.currentTarget.style.height = "auto";
							el.currentTarget.style.height = `${el.currentTarget.scrollHeight}px`;
						}}
					></textarea> */}
					<Button
						variant="primary"
						className="w-full"
						onClick={handleSubmit}
					>
						Publish the blog
					</Button>
				</div>
			</main>
		</CheckAuthentication>
	);
}

export default memo(NewBlog);
