import {
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	where,
} from "firebase/firestore";
import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loading } from "../App";
import Button from "../components/Button";
import { AppContext } from "../Context";
import { auth, db } from "../firebase-config";
import { UserInfoProps } from "../TYPES";
import NotFound from "./NotFound";

function Profile(): JSX.Element {
	const { userName } = useParams();
	const { userInfo: currentUserInfo } = useContext(AppContext);
	const [userInfo, setUserInfo] = useState<UserInfoProps | "NOT_FOUND" | "LOADING">("LOADING");
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
	}
	
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
				<>
					<header>
						<div
							className="relative mb-[25%] bg-cover bg-center"
							style={{
								aspectRatio: "2 / 1",
								backgroundImage: `url(${userInfo.coverPhotoURL})`,
							}}
						>
							<img
								src={userInfo.photoURL}
								alt={userInfo.name}
								className="absolute top-3/4 left-4 aspect-square h-1/2 rounded-full object-cover object-center ring-1 ring-slate-400"
							/>
						</div>
						<div className="space-y-2 p-4">
							<h1 className="text-2xl font-bold">{userInfo.name}</h1>
							<p className="text-lg">{userInfo.subTitle}</p>
							<p className="text-lg opacity-80">{userInfo.bio}</p>
							<div>
								{!isMyProfile && (
									<Button
										variant="primary"
										className="rounded-full py-1 px-2 text-sm"
									>
										Follow
									</Button>
								)}
							</div>
							{isMyProfile && (
								<div>
									<Button
										className="w-full"
										onClick={() => navigate("/settings/profile")}
									>
										Edit profile data
									</Button>
								</div>
							)}
						</div>
					</header>
					<article>
						Lorem ipsum dolor sit amet consectetur adipisicing elit. In,
						quibusdam odit id magnam exercitationem beatae asperiores
						dolorum rerum, quis necessitatibus non aspernatur sint maxime
						suscipit error repudiandae dolor? Nulla, voluptates?
					</article>
				</>
			)}
		</>
	);
}

export default Profile;