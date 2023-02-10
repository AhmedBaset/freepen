import { Timestamp } from "firebase/firestore";

export type UserInfoProps = {
	uid: string;
	name: string;
	userName: string;
	email: string;
	subTitle: string;
	photoURL: string;
	coverPhotoURL: string;
	bio: string;
	followers: number;
	followings: string[];
};

export type Blog = {
	id: string;
	title: string | undefined;
	body: string | undefined;
	image: string | undefined;
	authorId: string | undefined;
	blogInfo: {
		createdAt: Timestamp;
		readsCount: number;
		likes: string[];
		sharesCount: number;
		commentsCount: number;
	};
};

export type CommentProps = {
	id: string;
	blogId: string | undefined;
	text: string | undefined;
	authorId: string | undefined;
	commentInfo: {
		createdAt: Timestamp;
		readsCount: number;
		likes: string[];
	};
};

export type NotificationType = {
	type: "info" | "success" | "error";
	id: number;
	message: string;
	image: string | React.ReactElement;
	link: string | null;
	haveRead: boolean;
};
