import React from "react";
import { createPortal } from "react-dom";
import { AiOutlineClose } from "react-icons/ai";
import Button from "./Button";

function Modal({
	title,
	children,
	setModal,
}: {
	title: string;
	children: JSX.Element;
	setModal: React.Dispatch<
		React.SetStateAction<{
			isOpen: boolean;
			title: string;
			children: JSX.Element;
		}>
	>;
}) {
	const parent = document.getElementById("portal");

	if (!parent) return <></>;

	const closeModal = () => {
		setModal({ isOpen: false, title: "", children: <></> });
	};

	return createPortal(
		<div
			className="portal fixed inset-0 flex items-center justify-center p-4 backdrop-blur-xl"
			style={{ zIndex: 5000 }}
			onClick={closeModal}
		>
			<div className="w-80 max-w-full overflow-hidden rounded bg-slate-100 ring-2 ring-slate-400/50 dark:bg-slate-800 dark:text-white">
				<header className="rounded-inherite flex items-center justify-between border-b border-dashed border-slate-400/50 bg-slate-50 p-4 dark:bg-slate-900">
					<h1 className="text-2xl font-bold">{title}</h1>
					<AiOutlineClose
						onClick={closeModal}
						className="cursor-pointer"
					/>
				</header>
				<section className="overflow-auto p-4">{children}</section>
				<footer className="rounded-inherite border-b border-slate-400/50 bg-slate-50 p-4 dark:bg-slate-900">
					<Button onClick={closeModal} variant="primary">
						OK
					</Button>
				</footer>
			</div>
		</div>,
		parent
	);
}

export default Modal;
