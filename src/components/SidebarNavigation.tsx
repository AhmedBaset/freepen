import React from "react";
import { AiOutlineHome, AiOutlineLogin } from "react-icons/ai";
import { BiSearchAlt } from "react-icons/bi";
import { BsPencilSquare } from "react-icons/bs";
import { CiUser } from "react-icons/ci";
import { IoTrendingUp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase-config";

function SidebarNavigation() {
   const navigate = useNavigate()

   return (
		<aside className="flex w-12 flex-col items-center gap-3 p-1 py-3 pr-0 md:w-20 [&_svg]:cursor-pointer [&_svg]:rounded [&_svg]:bg-primary-500/20 [&_svg]:p-1 [&_svg]:text-3xl md:[&_svg]:p-2 md:[&_svg]:text-md [&_svg:hover]:bg-primary-500">
			{!auth.currentUser && (
				<AiOutlineLogin onClick={() => navigate("/login")} />
			)}
			<AiOutlineHome onClick={() => navigate("/")} />
			<BsPencilSquare onClick={() => navigate("/write")} />
			<IoTrendingUp onClick={() => navigate("/")} />
			<BiSearchAlt onClick={() => navigate("/search")} />
			{auth.currentUser && (
				<CiUser onClick={() => navigate("/profile")} />
			)}
		</aside>
	);
}

export default React.memo(SidebarNavigation);