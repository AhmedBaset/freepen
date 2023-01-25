import React from "react";

function Button(
	props: JSX.IntrinsicAttributes &
		React.ClassAttributes<HTMLButtonElement> &
		React.ButtonHTMLAttributes<HTMLButtonElement> & {
			variant?: "primary";
			icon?: React.ReactElement;
		}
) {
	return (
		<button
			{...props}
			className={`flex cursor-pointer items-center justify-center gap-2 rounded py-2 px-4 ring-1 ring-slate-300 focus:ring-4 dark:ring-slate-700
            ${
					props.variant === "primary"
						? `bg-primary-500 text-white hover:bg-primary-600`
						: `bg-slate-50 text-slate-900 hover:bg-slate-100 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-800`
				}
            ${props.className}`}
		>
			{props.icon && props.icon}
			{props.children}
		</button>
	);
}

export default React.memo(Button);
