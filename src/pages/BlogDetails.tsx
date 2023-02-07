import { useEffect, useState, memo } from "react";
import {
	collection,
	doc,
	getDoc,
	Timestamp,
	updateDoc,
} from "firebase/firestore";
import { useParams } from "react-router-dom";
import { auth, db } from "../firebase-config";
import { Blog, UserInfoProps, CommentProps } from "../TYPES";
import { CiCalendarDate, CiHeart, CiRead } from "react-icons/ci";
import { BsShare } from "react-icons/bs";
import Button from "../components/Button";
import { Loading } from "./../App";
import { marked } from "marked";
import Comment from "../components/Comment";
import { AiOutlineSend } from "react-icons/ai";

function BlogDetails() {
	const { id } = useParams();
	const [blog, setBlog] = useState<Blog | null>(null);
	const [author, setAuthor] = useState<UserInfoProps | null>(null);
	const [comments, setComments] = useState<CommentProps[]>([]);
	// const [error, setError] = useState("");

	document.title = `FreePen ${blog?.title}`;

	useEffect(() => {
		(async () => {
			try {
				const docRef = doc(collection(db, "blogs"), id);
				const blogSnapshoot = await getDoc(docRef);
				if (!blogSnapshoot.exists()) return; // setError("No such document!");
				setBlog(() => blogSnapshoot.data() as Blog);
				const authorRef = doc(db, "users", blogSnapshoot.data().authorId);
				const authorSnapshoot = await getDoc(authorRef);
				if (!authorSnapshoot.exists()) return; // setError("No such document!");
				setAuthor(() => authorSnapshoot.data() as UserInfoProps);

				const commentsRef = doc(db, "comments", blog?.id!);
				const commentsSnapshoot = await getDoc(commentsRef);
				if (!commentsSnapshoot.exists()) return; // setError("No such document!");
				setComments(
					() => commentsSnapshoot.data().comments as CommentProps[]
				);
			} catch (error: any) {
				// setError(error?.message);
				// console.error(error);
			}
		})();
	}, []);

	const pushComment = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const comment: CommentProps = {
			id: Math.random().toString(36).slice(2, 9),
			blogId: blog?.id,
			text: e.currentTarget.text.value,
			authorId: auth.currentUser?.uid,
			commentInfo: {
				createdAt: Timestamp.now(),
				readsCount: 0,
				likes: [],
			},
		};

		const commentsRef = doc(db, "comments", blog?.id!);
		const newCommentSnapshot = await updateDoc(commentsRef, {
			comments: [...comments, comment],
		});
	};

	if (!blog?.body) return <Loading />;

	return (
		<div className="container flex h-full flex-col md:flex-row">
			{/* The Main Content */}
			<div className="flex-auto">
				<main className="space-y-2 py-4">
					{/* Header => Headeing + Image */}
					<header className="space-y-3">
						<h1 className="text-2xl font-semibold md:text-5xl">
							{blog.title}
						</h1>
						<p className="flex items-center gap-2 text-sm font-light opacity-70">
							<CiCalendarDate /> Written at{" "}
							{blog.blogInfo.createdAt.toDate().toDateString()}
						</p>
						<div className="relative h-52 max-h-[60vh] overflow-hidden rounded shadow lg:h-96">
							<img
								src={blog.image}
								className="absolute inset-0 z-10 rounded object-cover object-center blur-lg"
								alt={blog.title}
							/>
							<img
								src={blog.image}
								className="relative z-20 h-full w-full rounded object-contain object-center"
								alt={blog.title}
							/>
						</div>
					</header>
					<div className="flex flex-col items-center justify-between gap-4 lg:flex-row">
						{/* Author Info */}
						{author && (
							<section className="flex items-center justify-between gap-3 rounded bg-slate-50 p-2 dark:bg-slate-900">
								<img
									src={author?.photoURL.toString()}
									className="h-10 w-10 rounded-2xl object-cover md:h-16 md:w-16"
									alt={author?.photoURL.toString()}
								/>
								<div className="flex-auto">
									<h2 className="font-medium md:text-2xl">
										{author?.name}
									</h2>
									<p className="text-xs opacity-60 md:text-sm">
										{author.subTitle}
									</p>
								</div>
								<Button
									variant="primary"
									className="rounded-full px-2 py-1 text-xs"
								>
									Follow
								</Button>
							</section>
						)}
						{/* Blog Reactions */}
						<section className="flex flex-wrap gap-4 divide-x-2 divide-dashed divide-slate-400/50 py-4">
							<div className="flex flex-auto items-center justify-center gap-4 p-4 text-center">
								<span className="md:text-3xl">
									<CiRead />
								</span>
								<span className="opacity-70">
									{blog.blogInfo.readsCount}
								</span>
							</div>
							<div className="flex flex-auto items-center justify-center gap-4 p-4 text-center">
								<span className="md:text-3xl">
									<CiHeart />
								</span>
								<span className="opacity-70">
									{blog.blogInfo.likesCount}
								</span>
							</div>
							<div className="flex flex-auto items-center justify-center gap-4 p-4 text-center">
								<span className="md:text-3xl">
									<BsShare />
								</span>
								<span className="opacity-70">
									{blog.blogInfo.sharesCount}
								</span>
							</div>
						</section>
					</div>
					{/* Blog Body */}
					<article
						className="prose py-4 px-1"
						dangerouslySetInnerHTML={{
							__html: marked(blog.body.replace(/<(.+)>/gm, "")),
						}}
					/>
					{/* <article className="prose py-4 px-1">
					<Markdown
						children={blog.body}
						remarkPlugins={[remarkGfm]}
						components={{
							a: ({ node, ...props }) => (
								<a {...props} target="_blank" />
							),
						}}
					/>
				</article> */}
				</main>
				{/* Comments */}
				<section className="space-x-3">
					<form onSubmit={pushComment} className="flex gap-2 p-2">
						<img src={author?.photoURL} alt={author?.name} />
						<textarea
							name="text"
							className="rounded ring-1 ring-slate-300 dark:ring-slate-900"
						></textarea>
						<button type="submit">
							<AiOutlineSend className="2xl" />
						</button>
					</form>
					{comments &&
						comments.map((comment) => (
							<Comment key={comment.id} comment={comment} />
						))}
				</section>
			</div>
			{/* The Sidebar */}
			<aside className="w-full md:w-80">
				{author && (
					<div className="flex flex-col items-center justify-center gap-2">
						<img
							src={author?.photoURL}
							alt={author?.name}
							className="aspect-square w-10 rounded-full ring-1 ring-primary-500 ring-offset-2"
						/>
						<h2 className="text-xl font-semibold">{author?.name}</h2>
						<p className="opacity-75">{author.bio}</p>
						<div className="flex items-center justify-center gap-2">
							<span className="opacity-80">{author?.followers}</span>
							{author.uid !== auth.currentUser?.uid && (
								<Button
									variant="primary"
									className="rounded-full py-1 px-2 text-sm"
								>
									Follow
								</Button>
							)}
						</div>
					</div>
				)}
			</aside>
		</div>
	);
}

export default memo(BlogDetails);
