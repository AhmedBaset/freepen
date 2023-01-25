import { useState, useEffect, useContext } from "react";
import { AppContext } from "../Context";
import { NotificationType } from "../TYPES";

enum NOTIFICATION_ACTIONS {
	ADD = "ADD",
	READ_ALL = "READ_ALL",
}

export const useNotification = () => {
	const { notifications, setNotifications } = useContext(AppContext);

	// TODO: PUSH NEW NOTIFICATION
	const newNotification = (
		type: "info" | "success" | "error",
		message: string,
		image: string | React.ReactElement,
		link: string | null
	) => {
		setNotifications?.((state) => [
			...state,
			{
				type,
				id: state.length,
				message,
				image,
				link,
				haveRead: false,
			},
		]);
	};

	// TODO: SET ALL NOTIFICATIONS AS READ
	const readAll = () => {
		setNotifications?.(state => state?.map((item) => {
			let newItem = item;
			if (newItem) newItem.haveRead = true

			return newItem
		}))
	};

	
	const [latestNotification, setLatestNotification] = useState<NotificationType>();

	useEffect(() => {
		setLatestNotification(() => notifications?.[notifications.length]);
	}, [notifications?.length]);

	return { notifications, newNotification, latestNotification, readAll };
};
