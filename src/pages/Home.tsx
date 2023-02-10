import { onAuthStateChanged, User } from "firebase/auth";
import { orderBy } from "firebase/firestore";
import React, { lazy, useContext, useEffect, useRef, useState } from "react";
import { CiWarning } from "react-icons/ci";
import { ImSpinner } from "react-icons/im";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import ListItemBlog from "../components/ListItemBlog";
import Slider from "../components/Slider";
import { AppContext } from "../Context";
import { auth } from "../firebase-config";
import { useGetDocs } from "../Hooks/useGetDocs";
import { Blog } from "../TYPES";

const Alert = lazy(() => import("../components/Alert"));

function Home() {
	const [authUser, setAuthUser] = useState<User | null>(null);
	const { userInfo, setCurrentPage } = useContext(AppContext);
	const navigate = useNavigate();
	const [homeStyle, setHomeStyle] = useState<"everyBody" | "followings">(
		"everyBody"
	);
	const [trends, trendsError, trendsLoading] = useGetDocs<Blog>(
		"blogs",
		{ limit: 10 },
		orderBy("blogInfo.readsCount", "desc")
		);
		const [blogsLimit, setBlogsLimit] = useState(1);
		const [blogs, blogsError, blogsLoading] = useGetDocs<Blog>(
		"blogs",
		{ limit: blogsLimit },
		orderBy("blogInfo.createdAt", "desc")
	);
	const [followingsBlogs, setFollowingsBlogs] = useState<Blog[]>([]);
	const loadMore = useRef() as React.MutableRefObject<HTMLDivElement>;

	useEffect(() => {
		setCurrentPage("HOME");
		document.title = "FreePen - Home"

		const unSubscribe = onAuthStateChanged(auth, (user) => setAuthUser(user));

		// trendsError
		// blogsError

		const observer = new IntersectionObserver((entries) => {
			if (entries[0].isIntersecting) {
				setBlogsLimit((prev) => prev + 1);
			}
		});


		document.title = "Free Pen - Home"

		observer.observe(loadMore?.current);

		return () => {
			unSubscribe();
		};
	}, []);

	useEffect(() => {
		if (homeStyle === "followings" && userInfo?.followings) {
			setFollowingsBlogs(
				blogs.filter((blog: Blog) =>
					userInfo.followings.includes(blog.authorId || "----")
				)
			);
		}
	}, [homeStyle, blogs.length]);

	useEffect(() => {
		console.log(blogs);
	}, [blogs.length]);

	return (
		<div className="container space-y-4 py-4">
			{!authUser && (
				<Alert
					title="You are not logged in"
					text="Please login to create a new blog"
					buttonText="Login"
					onClick={() => navigate("/login")}
					secondButtonText="Register"
					secondOnClick={() => navigate("/register")}
				/>
			)}
			{(!authUser?.emailVerified && authUser) && (
				<Alert
					title="Your email is not verified"
					text="Please verify your email to create a new blog"
					buttonText="Verify now"
					onClick={() => navigate("/EmailVerifying")}
				/>
			)}

			{/* Create New Blog */}
			<Button
				variant="primary"
				children="Write a blog"
				className="w-full rounded-full"
				onClick={() => navigate("/write")}
			/>

			{/* Trends */}
			{trends.length > 0 && (
				<div className="mt-4">
					<h1 className="mb-2 text-2xl font-bold">Trends:</h1>
					<Slider blogs={trends} />
				</div>
			)}

			{/* Blogs */}
			{blogs && (
				<>
					{/* -- Controller */}
					<div className="flex items-center justify-center gap-4">
						<input
							name="homeStyle"
							value="everyBody"
							checked={homeStyle === "everyBody"}
							onChange={(e) => setHomeStyle(e.target.value as any)}
							type="radio"
							id="everyBody"
							className="peer/everybody hidden appearance-none"
						/>
						<label
							htmlFor="everyBody"
							className="cursor-pointer rounded-full py-1 px-3 text-sm text-primary-500 ring-1 ring-primary-500 peer-checked/everybody:bg-primary-500 peer-checked/everybody:text-white"
							children="EveryBody"
						/>

						<input
							name="homeStyle"
							value="followings"
							checked={homeStyle === "followings"}
							onChange={(e) => setHomeStyle(e.target.value as any)}
							type="radio"
							id="followings"
							className="peer/followings hidden appearance-none"
						/>
						<label
							htmlFor="followings"
							className="cursor-pointer rounded-full py-1 px-3 text-sm text-primary-500 ring-1 ring-primary-500 peer-checked/followings:bg-primary-500 peer-checked/followings:text-white"
							children="Followings"
						/>
					</div>
					{/* -- Blogs List */}
					<div className="space-y-3">
						{(homeStyle === "everyBody" ? blogs : followingsBlogs).map(
							(blog: Blog) => (
								<ListItemBlog key={blog.id} blog={blog} />
							)
						)}
						{(homeStyle === "everyBody" ? blogs : followingsBlogs)
							.length === 0 && (
							<div className="p-4 text-center">
								<h1 className="text-xl text-center align-center">
									<CiWarning className="inline-block" /> There seems to be
									nothing new to read. Follow more bloggers or refresh
									the page.
								</h1>
							</div>
						)}
						<div className="p-8" ref={loadMore}>
							<ImSpinner className="mx-auto animate-spin text-5xl" />
						</div>
					</div>
				</>
			)}

			{(trendsLoading || false) && <h1 children="Loading... trends" />}
			{(blogsLoading || false) && <h1 children="Loading... blogs" />}
		</div>
	);
}

export default React.memo(Home);
