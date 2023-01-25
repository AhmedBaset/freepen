import React from "react";

function Input(
	props: JSX.IntrinsicAttributes &
		React.ClassAttributes<HTMLInputElement> &
		React.ClassAttributes<HTMLTextAreaElement> &
		React.InputHTMLAttributes<HTMLTextAreaElement> &
		React.InputHTMLAttributes<HTMLInputElement> & {
			icon?: React.ReactElement;
			element?: "input" | "textarea";
			flexgrow?: "true";
			icontop?: "true";
			customref?:any
		}
) {
	const Element = props.element || "input";

	return (
		<div className={`relative ${props.flexgrow && "flex-auto"}`}>
			<Element
				autoComplete="on"
				required={props.required === undefined && true}
				{...props}
				ref={props.customref}
				className={`w-full p-2 pl-10 bg-slate-50 rounded dark:bg-slate-800 ring-2 ring-transparent transition duration-300
					focus:ring-primary-400 [&:not(:focus)]:[&:not(:placeholder-shown)]:invalid:ring-rose-600/50 [&:not(:focus)]:valid:ring-green-600/50 
				${props.flexgrow && "h-full"} ${props.className}`}
			/>
			<span
				className={`pointer-none absolute inset-y-0 left-3 w-4 flex justify-center items-center pointer-events-none opacity-50 ${
					props.icontop && "top-3 bottom-auto"
				}`}
			>
				{props?.icon}
			</span>
		</div>
	);
}

export default React.memo(Input)