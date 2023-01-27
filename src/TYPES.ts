import { FieldValue, Timestamp } from "firebase/firestore";

export type UserInfoProps = {
	name: string;
	// userName: string;
	email: string;
	subTitle: string;
	photoURL: string;
}

export type Blog = {
	id: string;
	title: string | undefined;
	body: string | undefined;
	image: string | undefined;
	authorId: string | undefined;
	blogInfo: {
		createdAt: Timestamp;
		readsCount: number;
		likesCount: number;
		sharesCount: number;
		commentsCount: number;
	};
};

export type NotificationType = {
	type: "info" | "success" | "error";
	id: number;
	message: string;
	image: string | React.ReactElement;
	link: string | null
	haveRead: boolean
};