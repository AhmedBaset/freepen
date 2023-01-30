import {
	collection,
	doc,
	getDoc,
	getDocs,
	limit,
	orderBy,
	query,
	where,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Loading } from "../App";
import Button from "../components/Button";
import ListItemBlog from "../components/ListItemBlog";
import { AppContext } from "../Context";
import { auth, db } from "../firebase-config";
import { Blog, UserInfoProps } from "../TYPES";
import NotFound from "./NotFound";

function Profile(): JSX.Element {
	const { userName } = useParams();
	const { userInfo: currentUserInfo } = useContext(AppContext);
	const [userInfo, setUserInfo] = useState<
		UserInfoProps | "NOT_FOUND" | "LOADING"
	>("LOADING");
	const [blogs, setBlogs] = useState<Blog[]>([]);
	const [isMyProfile, setIsMyProfile] = useState(false);
	const navigate = useNavigate();

	// Functions
	const getUserId = async (userName: string) => {
		const q = query(
			collection(db, "users"),
			where("userName", "==", userName)
		);
		const querySnapshot = await getDocs(q);
		if (querySnapshot.empty) {
			setUserInfo("NOT_FOUND");
			return;
		} else {
			const id = querySnapshot.docs[0].id;
			return id;
		}
	};

	const getUserInfo = async (id: string) => {
		if (id === auth.currentUser?.uid) {
			setUserInfo(currentUserInfo as UserInfoProps);
			return;
		}

		const docRef = doc(db, "users", id);
		const docSnap = await getDoc(docRef);
		if (docSnap.exists()) {
			setUserInfo(docSnap.data() as UserInfoProps);
		}
	};
	// End Functions

	useEffect(() => {
		if (!userName) {
			setUserInfo("NOT_FOUND");
			return;
		}

		(async () => {
			const id = await getUserId(userName);
			if (id) {
				await getUserInfo(id);

				const q = query(
					collection(db, "blogs"),
					where("authorId", "==", id),
					limit(10),
					orderBy("blogInfo.createdAt", "desc")
				);
				const blogsSnapshoot = await getDocs(q);
				if (!blogsSnapshoot.empty) {
					const data = blogsSnapshoot.docs.map(
						(doc) => doc.data() as Blog
					);
					// Solution:
					console.log(data);
					setBlogs(data);
				}
			}
		})();

		if (userName === currentUserInfo?.userName) {
			setIsMyProfile(true);
		}

		return () => {
			setUserInfo("LOADING");
		};
	}, []);

	return (
		<>
			{userInfo === "LOADING" && <Loading />}
			{userInfo === "NOT_FOUND" && <NotFound />}
			{userInfo !== "NOT_FOUND" && userInfo !== "LOADING" && (
				<div className="container">
					<header
						className="rounded-lg bg-cover bg-center pt-48"
						style={{ backgroundImage: `url(${userInfo.coverPhotoURL})` }}
					>
						<div className="flex flex-col items-center gap-4 space-y-1 p-4 py-2 backdrop-blur-lg md:flex-row">
							<img
								src={userInfo.photoURL}
								alt={userInfo.name}
								className="ml-12 aspect-square h-48 rounded-full object-cover object-center ring-1 ring-slate-400"
							/>
							<div className="flex-auto text-center md:text-start">
								<h1 className="text-2xl font-bold">{userInfo.name}</h1>
								<p>{userInfo.subTitle}</p>
								<p className="text-xs opacity-60">
									@{userInfo.userName}
								</p>
								<p className="text-lg opacity-80">
									{userInfo.bio ||
										(isMyProfile && (
											<Link
												to="/settings/profile"
												className="text-primary-500 dark:text-primary-300"
											>
												Add Bio
											</Link>
										))}
								</p>
							</div>
							<div className="items-cetner flex flex-wrap justify-center gap-2">
								<span className="flex items-center justify-center">
									{userInfo.followers || "0"} followers
								</span>
								{!isMyProfile && (
									<Button
										variant="primary"
										className="rounded-full py-1 px-2 text-sm"
									>
										Follow
									</Button>
								)}
								{isMyProfile && (
									<div>
										<Button
											variant="primary"
											className="w-full"
											onClick={() => navigate("/settings/profile")}
										>
											Edit profile data
										</Button>
									</div>
								)}
							</div>
						</div>
					</header>
					{blogs && (
						<section className="space-y-2 py-4">
							{blogs.map((blog) => (
								<ListItemBlog blog={blog} key={blog.id} />
							))}
						</section>
					)}
				</div>
			)}
		</>
	);
}

export default Profile;
