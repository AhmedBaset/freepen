import { async } from "@firebase/util";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
import { auth, db } from "../firebase-config";
import { CommentProps, UserInfoProps } from "../TYPES";

type Props = { comment: CommentProps };

function Comment({ comment }: Props) {
	const [author, setAuthor] = useState({} as UserInfoProps);
	useEffect(() => {
		(async () => {
			if (!comment?.authorId) return;
			const authorRef = doc(db, "users", comment?.authorId);
			const authorSnapshoot = await getDoc(authorRef);
			setAuthor(authorSnapshoot.data() as UserInfoProps);
		})();
	}, []);

	const likeTheComment = async () => {
		if (!comment?.blogId) return;
		const commentRef = doc(db, "comments", comment?.blogId, comment?.id);
		const commentSnapshoot = await updateDoc(commentRef, {
			likes: [...comment.commentInfo.likes, auth.currentUser?.uid!],
		});
	};

	const dislikeTheComment = async () => {
		if (!comment?.blogId) return;
		const commentRef = doc(db, "comments", comment?.blogId, comment?.id);
		const commentSnapshoot = await updateDoc(commentRef, {
			likes: comment.commentInfo.likes.filter(
				(like) => like !== auth.currentUser?.uid!
			),
		});
	};

	return (
		<div className="relative grid grid-cols-[auto_1fr] gap-1 bg-white ring-1 ring-slate-300 dark:bg-slate-900 dark:ring-slate-700">
			<img
				src={author.photoURL}
				alt={author.name}
				className="sticky-0 aspect-square w-10 rounded-full"
			/>
			<div className="space-y-2">
				<h2 className="text-lg font-semibold">{author.name}</h2>
				<p>{comment.text}</p>
				<div className="flex gap-2">
					<span>{comment.commentInfo.likes.length}</span>
					{comment.commentInfo.likes.includes(auth.currentUser?.uid!) ? (
						<AiFillHeart onClick={dislikeTheComment} />
					) : (
						<AiOutlineHeart onClick={likeTheComment} />
					)}
				</div>
			</div>
		</div>
	);
}

export default Comment;
