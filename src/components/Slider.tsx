import React from "react";
import { BsArrowLeft, BsArrowRight } from "react-icons/bs";
import { Blog } from "../TYPES";
import ListItemBlog from "./ListItemBlog";

function Slider({ blogs }:{ blogs: Blog[] }) {
	const [current, setCurrent] = React.useState(0);
	const progressBar = React.useRef() as React.MutableRefObject<HTMLDivElement>;

	React.useEffect(() => {
		if (!blogs) return;
		const DURATION = 10000;
		const timeout = setTimeout(() => {
			setCurrent(current === blogs.length - 1 ? 0 : current + 1);
		}, DURATION);

		// create animation from width 0 to 100%
		progressBar.current.animate([{ width: "0%" }, { width: "100%" }], {
			duration: DURATION,
			easing: "linear",
			fill: "forwards",
		});

		return () => clearTimeout(timeout);
	}, [current]);

	return (
		<section className="overflow-hidden rounded bg-white ring-1 ring-slate-300 dark:bg-slate-900 dark:ring-slate-700">
			<div className="relative">
				{blogs.map((blog, index: number) => (
					<ListItemBlog
						key={blog.id}
						blog={blog}
						className={`absolute top-0 left-0 opacity-0 transition duration-300 ${
							current === index && "relative opacity-100"
						}`}
					/>
				))}
			</div>
			<div className="flex flex-wrap items-center justify-between gap-3 p-3">
				<BsArrowLeft
					onClick={() => setCurrent((prev) => prev - 1)}
					className="cursor-pointer text-primary-400"
				/>
				<div className="flex items-center justify-center gap-3">
					{blogs.map((blog, index) => (
						<span
							key={blog.id}
							className={`h-2 w-2 cursor-pointer rounded-full bg-primary-500/30 ${
								current === index && "bg-primary-400"
							}`}
							onClick={() => setCurrent(index)}
						></span>
					))}
				</div>
				<BsArrowRight
					onClick={() => setCurrent((prev) => prev + 1)}
					className="cursor-pointer text-primary-400"
				/>
			</div>
			<div className="relative h-1">
				<div
					ref={progressBar}
					className="absolute top-0 left-0 h-full bg-primary-400"
				></div>
			</div>
		</section>
	);
}

export default Slider;
