import React, { MouseEventHandler, useContext } from "react";
import { Link, To } from "react-router-dom";
import { HiMenuAlt3 } from "react-icons/hi";
import { GiHummingbird } from "react-icons/gi";
import {
	AiOutlineLogin,
	AiOutlineLogout,
	AiOutlineUserAdd,
} from "react-icons/ai";
import { IoClose } from "react-icons/io5";
import { auth } from "../firebase-config";
import { HANDLE_LOGOUT } from "../pages/Auth";
import { AppContext } from "../Context";

function Navbar() {
	const { userInfo } = useContext(AppContext);
	const [menuExpand, setMenuExpand] = React.useState(false);

	return (
		<nav className="sticky top-0 z-40 h-12 bg-primary-500/80 shadow-lg backdrop-blur-md">
			<div className="container flex h-12 items-center justify-between px-2 md:px-8">
				<Link
					to="/"
					className="flex items-center gap-1 text-xl font-semibold  text-white"
				>
					<img
						src={require("./../assets/logo.png")}
						alt="logo"
						className="h-8 w-8 invert"
					/>
					<span>FreePen</span>
				</Link>

				<ul className="flex items-center gap-2">
					{auth.currentUser && (
						<button
							onClick={() => HANDLE_LOGOUT()}
							className="hidden md:block"
							title="show my profile"
						>
							<img
								src={userInfo?.photoURL}
								alt={userInfo?.name}
								className="h-6 w-6 rounded-full object-cover object-center ring-1 ring-primary-900 ring-offset-1"
							/>
						</button>
					)}
					<button
						className="rounded-full bg-white p-1 align-middle text-xl text-primary-500"
						onClick={() => setMenuExpand((v) => !v)}
					>
						{!menuExpand ? <HiMenuAlt3 /> : <IoClose />}
					</button>
				</ul>
			</div>

			<div
				className={`container fixed top-12 left-1/2 z-40 flex translate-x-[-50%] justify-end p-4 ${
					menuExpand ? "pointer-events-auto" : "pointer-events-none"
				}`}
			>
				<ul
					className="w-[500px] max-w-full divide-y-2 divide-transparent rounded bg-white p-4 text-slate-800 shadow shadow-slate-400/50 transition-[clip-path] duration-300 dark:bg-slate-900 dark:text-white"
					style={{
						clipPath: `circle(${menuExpand ? "200%" : "0"} at 100% 0%)`,
					}}
				>
					<NavItem
						closeFN={() => setMenuExpand(false)}
						condition={auth?.currentUser}
						to="/profile"
						icon={
							<img
								src={userInfo?.photoURL}
								alt={userInfo?.name}
								className="h-8 w-8 rounded-full object-cover object-center ring-1 ring-primary-900 ring-offset-1"
							/>
						}
						text={userInfo?.name}
					/>
					<NavItem
						closeFN={() => setMenuExpand(false)}
						condition={auth.currentUser}
						onClick={() => HANDLE_LOGOUT()}
						text="Logout"
						icon={<AiOutlineLogout className="text-lg" />}
						to="/"
					/>

					<NavItem
						closeFN={() => setMenuExpand(false)}
						condition={!auth.currentUser}
						text="Register"
						icon={<AiOutlineUserAdd className="text-lg" />}
						to="/register"
					/>
					<NavItem
						closeFN={() => setMenuExpand(false)}
						condition={!auth.currentUser}
						text="Login"
						icon={<AiOutlineLogin className="text-lg" />}
						to="/login"
					/>
				</ul>
			</div>
		</nav>
	);
}

const NavItem = (props: {
	closeFN: MouseEventHandler<HTMLLIElement> | undefined;
	condition: any;
	to: To;
	icon: any;
	text: string | undefined | null;
	onClick?: React.MouseEventHandler<HTMLAnchorElement> | undefined;
}) => {
	if (props.condition) {
		return (
			<li className="flex items-center gap-3" onClick={props.closeFN}>
				<Link
					className="flex w-full items-center gap-2 rounded p-2 hover:bg-slate-100 hover:shadow dark:hover:bg-slate-800"
					to={props.to}
					onClick={props.onClick}
				>
					<>
						{props.icon && props.icon}
						<span className="flex-auto">{props.text}</span>
					</>
				</Link>
			</li>
		);
	}
	return <></>;
};

export default React.memo(Navbar);
