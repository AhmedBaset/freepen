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

	const closeModal = () =>
		setModal({ isOpen: false, title: "", children: <></> });

	return createPortal(
		<div
			className="portal fixed inset-0 flex items-center justify-center p-4 backdrop-blur-xl"
			style={{ zIndex: 5000 }}
			onClick={closeModal}
		>
			<dialog className="overflow-hidden rounded bg-slate-100 ring-2 ring-slate-400/50 dark:bg-slate-800">
				<header className="rounded-inherite border-b border-slate-400/50 bg-slate-50 p-2 dark:bg-slate-900 flex items-center justify-between">
					<h1 className="text-2xl font-bold">{title}</h1>
					<AiOutlineClose onClick={closeModal} />
				</header>
				<section className="overflow-auto">{children}</section>
				<footer className="rounded-inherite border-b border-slate-400/50 bg-slate-50 p-2 dark:bg-slate-900">
					<Button onClick={closeModal} variant="primary">
						OK
					</Button>
				</footer>
			</dialog>
		</div>,
		parent
	);
}

export default Modal;
