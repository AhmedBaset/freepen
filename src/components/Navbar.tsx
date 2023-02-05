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
		<nav className="z-40 bg-primary-500/80 backdrop-blur-md sticky top-0 shadow-lg">
			<div className="container h-12 px-2 md:px-8 flex justify-between items-center">
				<Link
					to="/"
					className="font-semibold text-xl flex items-center gap-1  text-white"
				>
					<GiHummingbird /> Freedom
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
								className="w-6 h-6 object-cover object-center rounded-full ring-1 ring-primary-900 ring-offset-1"
							/>
						</button>
					)}
					<button
						className="bg-white p-1 rounded-full text-xl text-primary-500 align-middle"
						onClick={() => setMenuExpand((v) => !v)}
					>
						{!menuExpand ? <HiMenuAlt3 /> : <IoClose />}
					</button>
				</ul>
			</div>

			<div className={`z-40 fixed top-12 left-1/2 translate-x-[-50%] container flex justify-end p-4 ${menuExpand ? "pointer-events-auto": "pointer-events-none"}`}>
				<ul
					className="w-[500px] max-w-full bg-white text-slate-800 dark:bg-slate-900 dark:text-white shadow shadow-slate-400/50 rounded p-4 divide-y-2 divide-transparent transition-[clip-path] duration-300"
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
								className="w-8 h-8 object-cover object-center rounded-full ring-1 ring-primary-900 ring-offset-1"
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
					className="w-full p-2 rounded hover:bg-slate-100 hover:shadow dark:hover:bg-slate-800 flex gap-2 items-center"
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

export default React.memo(Navbar)