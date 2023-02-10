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
					<div className="container grid flex-auto grid-cols-1 grid-rows-1 md:grid-cols-[auto_1fr]">
						<SidebarNavigation />
						<div className="overflow-y-auto">
							<Outlet />
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default React.memo(Root);
