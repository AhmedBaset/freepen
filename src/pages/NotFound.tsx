import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import { AppContext } from "../Context";

function NotFound() {
	const navigate = useNavigate();
	const {setCurrentPage} = useContext(AppContext)

	useEffect(()=> {
		setCurrentPage("")
		document.title = "FreePen - Page is not found"
	}, [])


	return (
		<main className="container space-y-4 flex flex-col justify-center h-full">
			<h2 className="text-7xl text-pink-500 font-black flex">
				<span className="block -rotate-12">4</span>
				<span className="block rotate-0">0</span>
				<span className="block rotate-12">4</span>
			</h2>
			<h3 className="text-3xl">The page you are looking for is not found</h3>
			<div className="flex gap-4">
				<Button variant="primary" onClick={() => navigate("/")}>Go Home</Button>
			</div>
		</main>
	);
}

export default React.memo(NotFound);