import React, { useContext, useRef } from "react";
import { AiOutlineHome, AiOutlineLogin } from "react-icons/ai";
import { BiSearchAlt } from "react-icons/bi";
import { BsPencilSquare } from "react-icons/bs";
import { CiUser } from "react-icons/ci";
import { IoTrendingUp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../Context";
import { auth } from "../firebase-config";

function SidebarNavigation() {
	const navigate = useNavigate();
	const { currentPage } = useContext(AppContext);

	return (
		<aside className="fixed inset-x-0 ring-1 md:ring-0 ring-slate-400/20 bottom-0 flex flex-row items-center justify-center gap-3 p-3 shadow backdrop-blur max-md:row-start-2 md:relative md:flex-col md:justify-start [&_svg]:cursor-pointer [&_svg]:rounded [&_svg]:bg-primary-500/20 [&_svg]:p-2 [&_svg]:text-3xl [&_svg:hover]:bg-primary-400 [&_svg.is-active]:bg-primary-500">
			{!auth.currentUser && (
				<AiOutlineLogin
					name="LOGIN"
					onClick={() => navigate("/login")}
					className={currentPage === "LOGIN" ? "is-active" : ""}
				/>
			)}
			<AiOutlineHome
				name="HOME"
				onClick={() => navigate("/")}
				className={currentPage === "HOME" ? "is-active" : ""}
			/>
			<BsPencilSquare
				name="WRITE"
				onClick={() => navigate("/write")}
				className={currentPage === "WRITE" ? "is-active" : ""}
			/>
			<IoTrendingUp name="" onClick={() => navigate("/")} />
			<BiSearchAlt
				name="SEARCH"
				onClick={() => navigate("/search")}
				className={currentPage === "SEARCH" ? "is-active" : ""}
			/>
			{auth.currentUser && (
				<CiUser
					name="PROFILE"
					onClick={() => navigate("/profile")}
					className={currentPage === "PROFILE" ? "is-active" : ""}
				/>
			)}
		</aside>
	);
}

export default React.memo(SidebarNavigation);
