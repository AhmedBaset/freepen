import React, { useState } from "react";
import Button from "../components/Button";
import { auth } from "../firebase-config";
import { AiOutlineLogin, AiOutlineUserAdd } from "react-icons/ai";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";

type Props = { children: React.ReactNode };

function CheckAuthentication({ children }: Props): JSX.Element {
	const [isAuth, setIsAuth] = useState<Boolean | "loading">("loading");
	const navigate = useNavigate();

	onAuthStateChanged(auth, (user) => {
		setIsAuth(() => Boolean(user));
	});

	if (isAuth) {
		return <>{children}</>;
	} else if (isAuth === "loading") {
		return <h1>Loading...</h1>;
	} else
		<main className="container flex h-full flex-col items-center justify-center space-y-4">
			<h2 className="text-9xl font-bold">
				<span className="inline-block -rotate-12 text-primary-400">4</span>
				<span className="inline-block text-rose-500">0</span>
				<span className="inline-block rotate-12 text-primary-400">4</span>
			</h2>
			<h3 className="text-3xl">You have login to access this page</h3>
			<div className="flex gap-4">
				<Button
					icon={<AiOutlineUserAdd />}
					variant="primary"
					onClick={() => navigate("/register")}
				>
					Register
				</Button>
				<Button
					icon={<AiOutlineLogin />}
					onClick={() => navigate("/login")}
				>
					Login
				</Button>
			</div>
		</main>;

	return <></>;
}

export default React.memo(CheckAuthentication);
