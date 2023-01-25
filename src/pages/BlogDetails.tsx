import { useEffect, useState, memo } from "react";
import {
	collection,
	doc,
	getDoc,
} from "firebase/firestore";
import { useParams } from "react-router-dom";
import { db } from "../firebase-config";
import { Blog } from "../TYPES";
import Markdown from "react-markdown";


function BlogDetails() {
	const { id } = useParams();
	const [blog, setBlog] = useState<Blog | null>(null);
	// const [error, setError] = useState("");

	useEffect(() => {
		(async () => {
			const docRef = doc(collection(db, "blogs"), id);

			try {
				const docSnapshoot = await getDoc(docRef);

				if (docSnapshoot.exists()) {
					setBlog(() => docSnapshoot.data() as Blog);
	            console.log(docSnapshoot.data());

				}
	      } catch (error: any) {
	         // setError(error?.message);
	         // console.error(error);
	      }
		})();
	}, []);

	if (!blog) return <h1>Loading...</h1>;

	return (
		<main className="h-full p-4 bg-slate-50 dark:bg-slate-900">
			<div className="container">
				<header className="aspect-video relative bg-primary-500 rounded overflow-hidden">
					<img
						src={blog?.image?.toString()}
						className="absolute inset-0 w-full h-full object-cover object-position-center"
					/>
					<h1 className="text-xl md:text-5xl p-4 md:p-y-8 font-bold absolute bottom-0 inset-x-0 bg-gradient-to-t from-slate-50 dark:from-slate-900 to-transparen t">
						{blog?.title}
					</h1>
				</header>
				<article className="p-4 prose dark:prose-invert">
					{blog.body && <Markdown>{ blog?.body}</Markdown>}
				</article>
			</div>
		</main>
	);
}

export default memo(BlogDetails);