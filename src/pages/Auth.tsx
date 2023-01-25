import React, { useEffect, useState } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { FcGoogle } from "react-icons/fc";
import { MdOutlineMailOutline, MdOutlinePassword } from "react-icons/md";
import {
	createUserWithEmailAndPassword,
	GoogleAuthProvider,
	signInWithEmailAndPassword,
	signInWithPopup,
	signOut,
	sendEmailVerification,
	onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db, storage } from "../firebase-config";
import Input from "../components/Input";
import { IoMailUnreadOutline } from "react-icons/io5";
import { UserInfoProps } from "../TYPES";
import { AiOutlineUser } from "react-icons/ai";
import { getDownloadURL, ref } from "firebase/storage";
//! import { useNotification } from "../Hooks/useNotification";

function Auth({ type }: { type: "login" | "register" }) {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [name, setName] = useState({ first: "", last: "" });
	const navigate = useNavigate();


	//! const { newNotification } = useNotification();

	// TODO: SIGN IN WITH GOOGLE
	const SIGN_IN_WITH_GOOGLE = () => {
		const provider = new GoogleAuthProvider();
		signInWithPopup(auth, provider)
			.then((auth) => {
				//! newNotification("success", "Welcome back! Signed in successfully", <AiOutlineUserSwitch />, null)

				const docRef = doc(db, "users", auth?.user?.uid);
				getDoc(docRef).then((snapShot) => {
					if (!snapShot.exists()) {
						const userInfo: UserInfoProps = {
							name: auth.user.displayName || "",
							email: auth.user.email || "",
							photoURL: auth.user.photoURL || "",
							subTitle: ""
						};
						setDoc(docRef, userInfo).then(() => {
							navigate("/");
						});
					}
				});
			})
			.catch((err) => {
				//! newNotification("error", err.message, <BiErrorCircle />, null)
			});
	};

	// TODO: LOGIN IN
	const HANDLE_LOGIN = (event: React.FormEvent) => {
		event.preventDefault();

		signInWithEmailAndPassword(auth, email, password)
			.then((userCredential) => {
				//! newNotification("success", "Welcome back! Signed in successfully", <AiOutlineUserSwitch />, null)
				if (userCredential.user.emailVerified) navigate("/");
				else navigate("/EmailVerifying");
			})
			.catch((err) => {
				//! newNotification("error", err.message, <BiErrorCircle />, null)
			});
	};

	// TODO: REGISTER
	const HANDLE_REGISTER = async (event: React.FormEvent) => {
		event.preventDefault();

		try {
			const createUserData = await createUserWithEmailAndPassword(
				auth,
				email,
				password
			);

			const defaultImage = await getDownloadURL(ref(storage, "users/default.png"))
			
			//! newNotification("success", "Welcome back! Signed in successfully", <AiOutlineUserSwitch />, null);

			const docRef = doc(db, "users", createUserData?.user?.uid);
			const snapShot = await getDoc(docRef);
			if (!snapShot.exists()) {
				const userInfo: UserInfoProps = {
					name: `${name.first} ${name.last}`,
					email: createUserData.user.email || "",
					photoURL: createUserData.user.photoURL || defaultImage,
					subTitle: ""
				};
				try {
					await setDoc(docRef, userInfo);
				} catch (error) {
					console.error(error);
				}
			}

			try {
				await sendEmailVerification(createUserData.user);
			} catch (error) {
				console.error(error);
			}
			navigate("/EmailVerifying");
		} catch (error) {
			console.error(error);
		}
	};

	// TODO: RETURN JSX
	return (
		<main className="h-full flex justify-center items-center">
			<section className="w-[500px] max-w-full bg-white rounded-lg shadow ring-2 ring-slate-300 dark:bg-slate-900 dark:ring-slate-700">
				<header className="grid grid-cols-2 border-b-px bg-slate-300 dark:bg-slate-700 border-b-slate-300 dark:border-b-slate-700">
					<Link
						to="/register"
						className={`p-3 text-center rounded-t-lg ${
							type === "register" && "bg-white dark:bg-slate-900"
						}`}
					>
						Register
					</Link>
					<Link
						to="/login"
						className={`p-3 text-center rounded-t-lg ${
							type === "login" && "bg-white dark:bg-slate-900"
						}`}
					>
						Login
					</Link>
				</header>
				<article className="py-6 px-3 flex flex-col gap-4 [&>*]:w-full">
					<Button
						className="w-full"
						icon={<FcGoogle />}
						onClick={() => SIGN_IN_WITH_GOOGLE()}
					>
						Continue with Google
					</Button>

					<div className="flex gap-2 items-center">
						<hr className="flex-auto border-slate-400/50" />
						<span>OR</span>
						<hr className="flex-auto border-slate-400/50" />
					</div>
					{type === "login" && (
						<form
							className="flex flex-col gap-4 [&>*]:w-full"
							autoComplete="off"
							onSubmit={HANDLE_LOGIN}
						>
							<Input
								required
								pattern="^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$"
								title="Someone@example.com"
								icon={<MdOutlineMailOutline />}
								type="mail"
								name="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="Email"
							/>
							<Input
								required
								pattern="[A-Za-z0-9.@#*&^%$()-_+]{8,}"
								title="at least 8 characters"
								icon={<MdOutlinePassword />}
								type="password"
								name="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Password"
							/>
							<Button variant="primary" className="w-full">
								Login
							</Button>
						</form>
					)}
					{type === "register" && (
						<form
							className="flex flex-col gap-4 [&>*]:w-full"
							autoComplete="off"
							onSubmit={HANDLE_REGISTER}
						>
							<div className="grid grid-cols-2 gap-2">
								<Input
									required
									pattern="[A-Za-z]{2,15}"
									icon={<AiOutlineUser />}
									type="text"
									name="fName"
									value={name.first}
									onChange={(e) =>
										setName((v) => ({ ...v, first: e.target.value }))
									}
									placeholder="First Name"
								/>
								<Input
									required
									pattern="[A-Za-z]{2,15}"
									icon={<AiOutlineUser />}
									type="text"
									name="lName"
									value={name.last}
									onChange={(e) =>
										setName((v) => ({ ...v, last: e.target.value }))
									}
									placeholder="Last Name"
								/>
							</div>
							<Input
								required
								pattern="^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$"
								title="Someone@example.com"
								icon={<MdOutlineMailOutline />}
								type="mail"
								name="email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
								placeholder="Email"
							/>
							<Input
								required
								pattern="[A-Za-z0-9.@#*&^%$()-_+]{8,}"
								title="at least 8 characters"
								icon={<MdOutlinePassword />}
								type="password"
								name="password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								placeholder="Password"
							/>
							<Button variant="primary" className="w-full">
								Create account
							</Button>
						</form>
					)}
				</article>
			</section>
		</main>
	);
}

// TODO: VERIFY EMAIL
export function ConfirmEmail(): JSX.Element {
	const [output, setOutput] = useState(<>Loading</>);
	const navigate = useNavigate();

	useEffect(() => {
		onAuthStateChanged(auth, (user) => {
			if (!user) setOutput(<Navigate to="/login" />);
			else if (user?.emailVerified === false) {
				setOutput(
					<main className="h-full flex justify-center items-center">
						<section className="w-[500px] max-w-full bg-white rounded-lg shadow ring-2 ring-slate-300 dark:bg-slate-900 dark:ring-slate-700 p-4 flex flex-col gap-4">
							<IoMailUnreadOutline className="text-7xl text-primary-500" />
							<h2 className="text-3xl font-semibold">
								Verify your email
							</h2>
							<p className="opacity-80">
								We have sand an email contains a link, follow the link
								to verify your email.
							</p>
							<p className="opacity-80">
								Then refrish the page please.
							</p>
							<p className="opacity-80">
								<span className="text-bold">NOTE:</span> If you can't
								find it. Please check the spam.
							</p>
							<div className="flex gap-4">
								<Button onClick={() => navigate("/")}>
									Tell me later
								</Button>
							</div>
						</section>
					</main>
				);
			} else if (user.emailVerified) setOutput(<Navigate to="/" />);
			else {
				console.log(
					"SOMETHING IS WRONG ==> Auth.tsx > ConfirmEmail() > else"
				);
			}
		});
	}, []);

	return <>{output}</>;
}

// TODO: LOGOUT
export function HANDLE_LOGOUT() {
	signOut(auth);
}

export default React.memo(Auth)