import React, { createContext, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "./firebase-config";
import { NotificationType, UserInfoProps } from "./TYPES";
import { doc, getDoc } from "firebase/firestore";
import Modal from "./components/Modal";

type ContextProps = {
	userInfo: UserInfoProps | null;
	notifications: (NotificationType | undefined)[];
	setNotifications: React.Dispatch<
		React.SetStateAction<(NotificationType | undefined)[]>
	>;
	newError: (error: any) => void;
	openModal: (
		title: string,
		children: JSX.Element,
	) => void;
	currentPage: Pages;
	setCurrentPage: React.Dispatch<React.SetStateAction<Pages>>;
	};

type Pages = "HOME" | "LOGIN" | "PROFILE" | "WRITE" | "SEARCH" | "";

export const AppContext = createContext<ContextProps>({
	userInfo: null,
	notifications: [],
	setNotifications: () => null,
	newError: (error: any) => null,
	openModal: (title: string, children: JSX.Element, autoClose?: boolean) =>
		null,
	currentPage: "",
	setCurrentPage: () => null,
});

type Props = {
	children: React.ReactNode;
};


function Context({ children }: Props) {
	const [userInfo, setUserInfo] = useState<UserInfoProps | null>(null);
	const [modal, setModal] = useState({
		isOpen: false,
		title: "",
		children: <></>
	});
	const [currentPage, setCurrentPage] = useState<Pages>("");

	onAuthStateChanged(auth, async () => {
		if (auth?.currentUser?.uid) {
			const docRef = doc(db, "users", auth.currentUser.uid);
			const snapShot = await getDoc(docRef);
			setUserInfo(() => ({ ...(snapShot.data() as UserInfoProps) }));
		}
	});

	const newError = (error: any) => {
		console.error(error);
	};

	// MODAL:
	const openModal = (
		title: string = "Dialog",
		children: JSX.Element
	) => {
		setModal({ isOpen: true, title, children });
	};

	// TODO: initialize Notification env
	const [notifications, setNotifications] = useState<
		(NotificationType | undefined)[]
	>([]);

	return (
		<>
			<AppContext.Provider
				value={{
					userInfo,
					notifications,
					setNotifications,
					newError,
					openModal,
					currentPage,
					setCurrentPage
				}}
			>
				{children}
			</AppContext.Provider>
			{modal.isOpen ? (
				<Modal title={modal.title} setModal={setModal}>
					{modal.children}
				</Modal>
			) : null}
		</>
	);
}

export default React.memo(Context);
