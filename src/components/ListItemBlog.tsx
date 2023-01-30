import React from "react";
import { Blog } from "./../TYPES";

function ListItemBlog({ blog }: { blog: Blog }) {
	return (
		<article
			key={blog.id}
			className="flex max-h-full flex-col overflow-hidden rounded bg-white ring-1 ring-slate-300 dark:bg-slate-900 dark:ring-slate-700 md:max-h-64 md:flex-row"
		>
			<img
				src={blog.image}
				alt={blog.title}
				className="aspect-video h-auto w-full object-cover object-center md:h-full md:w-auto md:max-w-[300px]"
			/>
			<div className="flex-auto p-2">
				<h2 className="text-xl font-semibold">{blog.title}</h2>
				<p className="text-[12px] opacity-60">
					{blog.blogInfo.createdAt.toDate().toDateString()}
				</p>
				<p className="max-h-20 overflow-hidden text-ellipsis text-xs font-light opacity-80 [line-clamp:3] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:3]">
					{blog.body!.replace(/[#(\[.+\])(\(.+\))\!>\*\-_~]/gm, "")}
				</p>
			</div>
		</article>
	);
}

export default ListItemBlog;
