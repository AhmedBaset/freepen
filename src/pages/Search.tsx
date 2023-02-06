import { collection, getDocs, query, where } from "firebase/firestore";
import React from "react";
import { BiSearchAlt } from "react-icons/bi";
import ListItemBlog from "../components/ListItemBlog";
import { AppContext } from "../Context";
import { db } from "../firebase-config";
import { Blog } from "../TYPES";

function Search() {
	const [searchWords, setSearchWords] = React.useState("");
	const [allBlogs, setAllBlogs] = React.useState<Blog[]>([]);
	const [results, setResults] = React.useState<Blog[]>([]);
	const [error, setError] = React.useState("");
	const input = React.useRef() as React.MutableRefObject<HTMLInputElement>;
	const { setCurrentPage } = React.useContext(AppContext);

	React.useEffect(() => {
		document.title = "Search | Blog App";
		setCurrentPage("SEARCH");
	}, []);

	React.useEffect(() => {
		input.current?.focus();
		console.log(input);

		// README: This is just the beginning. When the app grow up I am using a search engine like algolia or elastic search.
		(async () => {
			try {
				const colRef = collection(db, "blogs");
				const querySnapshot = await getDocs(colRef);
				const data = querySnapshot.docs.map((doc) => doc.data() as Blog);
				setAllBlogs(data);
			} catch (error: any) {
				console.error(error);
				setError(error.message);
			}
		})();
	}, []);

	const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (searchWords.trim() === "") {
			setError("Please enter a search term");
			return;
		} else {
			const searchWordsArray = searchWords.split(" ");
			const searchResults: Blog[] = [];
			searchWordsArray.forEach((word) => {
				searchResults.push(
					...allBlogs.filter(
						(blog) =>
							blog.title?.toLowerCase().includes(word.toLowerCase()) ||
							blog.body?.toLowerCase().includes(word.toLowerCase())
					)
				);
			});
			setResults(searchResults);
			setError(
				searchResults.length === 0
					? "No results found. Try again please"
					: ""
			);
		}
	};

	return (
		<div className="container space-y-3 p-3">
			<form onSubmit={handleSearch} className="flex gap-2">
				<input
					className="flex-auto rounded bg-slate-50 p-2 ring-1 ring-slate-300 transition duration-300 focus:ring-primary-400 dark:bg-slate-800
					dark:ring-slate-700"
					type="text"
					placeholder="Search"
					value={searchWords}
					onChange={(e) => setSearchWords(e.target.value)}
				/>
				<button
					type="submit"
					className="flex aspect-square h-10 items-center justify-center rounded bg-primary-500 text-xl text-white"
				>
					<BiSearchAlt />
				</button>
			</form>

			{error && <div className="p-4 text-center opacity-75">{error}</div>}

			<div className="space-y-3">
				{results.map((result) => (
					<ListItemBlog key={result.id} blog={result} />
				))}
			</div>
		</div>
	);
}

export default Search;
