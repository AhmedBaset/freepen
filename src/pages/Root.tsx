import React from "react";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import SidebarNavigation from "../components/SidebarNavigation";

function Root() {
	return (
		<>
			<div className="min-h-screen">
				<div className="flex h-screen flex-col overflow-auto dark:bg-slate-800 dark:text-white">
					<Navbar />
					<div className="container grid flex-auto grid-cols-[auto_1fr]">
						<SidebarNavigation />
						<Outlet />
					</div>
				</div>
			</div>
		</>
	);
}

export default React.memo(Root);
