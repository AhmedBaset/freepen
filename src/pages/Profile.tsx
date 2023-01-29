import {
	collection,
	doc,
	getDoc,
	getDocs,
	query,
	where,
} from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Loading } from "../App";
import Button from "../components/Button";
import { AppContext } from "../Context";
import { auth, db } from "../firebase-config";
import { UserInfoProps } from "../TYPES";
import NotFound from "./NotFound";

function Profile() {
	const { userInfo: currentUser } = useContext(AppContext);
	const { userName: userNameParam } = useParams();
	const [id, setId] = useState("");
   const [userInfo, setUserInfo] = useState({} as UserInfoProps);
   const navigate = useNavigate();

	// Functions
	const checkUser = async () => {
		try {
			// Get user from database
			const userNameSnapshoot = await getDocs(
				query(
					collection(db, "users"),
					where("userName", "==", userNameParam)
				)
			);
			// If exists
			if (userNameSnapshoot.docs.length > 0) {
				setId(userNameSnapshoot.docs[0].id);
			} else if (currentUser) {
				// If not exists
				setId(currentUser?.uid);
			} else {
				// If not logged in
				setId("Not found");
			}
		} catch (error) {}
	};

	const getUserInfo = async () => {
		const docRef = doc(db, "users", id);
		const docSnap = await getDoc(docRef);
		if (docSnap.exists()) {
			setUserInfo(docSnap.data() as UserInfoProps);
		}
	};

	// End Functions

	useEffect(() => {
		(async () => {
			await checkUser();

			if (id !== "" && id !== "Not found") {
				await getUserInfo();
			}
		})();
	}, []);

   if (id === "") <Loading />;
   else if (id === "Not found") <NotFound />;
   else if (userInfo) {
      return (
			<>
				<header>
					<div
						className="relateve mb-[25%] bg-cover bg-center"
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
							{id !== auth.currentUser?.uid && (
								<Button
									variant="primary"
									className="rounded-full py-1 px-2 text-sm"
								>
									Follow
								</Button>
							)}
						</div>
						{id === auth.currentUser?.uid && (
							<div>
								<Button
									className="w-full"
									onClick={() => navigate("/settings/profile")}
								>
									Edit your profile date
								</Button>
							</div>
						)}
					</div>
				</header>
				<article>
					Lorem ipsum dolor sit amet consectetur adipisicing elit. In,
					quibusdam odit id magnam exercitationem beatae asperiores dolorum
					rerum, quis necessitatibus non aspernatur sint maxime suscipit
					error repudiandae dolor? Nulla, voluptates?
				</article>
			</>
		);
   }
}

export default Profile;
