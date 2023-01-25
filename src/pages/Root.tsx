import React from "react";
import Navbar from "../layouts/Navbar";
import { Outlet } from "react-router-dom";

function Root() {
	return (
		<>
			<div className="min-h-screen">
				<div className="flex h-screen flex-col overflow-auto dark:bg-slate-800 dark:text-white">
					<Navbar />
					<div className="flex-auto">
						<Outlet />
					</div>
				</div>
			</div>
		</>
	);
}

export default React.memo(Root);