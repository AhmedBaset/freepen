import { Suspense, lazy } from "react";
import { createPortal } from "react-dom";
import {
	createBrowserRouter,
	createRoutesFromElements,
	Navigate,
	Route,
	RouterProvider,
} from "react-router-dom";
import { ImSpinner6 } from "react-icons/im";
import { auth, db } from "./firebase-config";
import { doc, getDoc } from "firebase/firestore";

const Context = lazy(() => import("./Context"));
const Root = lazy(() => import("./pages/Root"));
const Home = lazy(() => import("./pages/Home"));
const Auth = lazy(() => import("./pages/Auth"));
const ConfirmEmail = lazy(() =>
	import("./pages/Auth").then((module) => ({
		default: module.ConfirmEmail,
	}))
);
const Profile = lazy(() => import("./pages/Profile"));
const NewBlog = lazy(() => import("./pages/NewBlog"));
const BlogDetails = lazy(() => import("./pages/BlogDetails"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
	// TODO: HANDLE ROUTERS
	const router = createBrowserRouter(
		createRoutesFromElements(
			<Route path="/" element={<Root />}>
				<Route index element={<Home />} />
				<Route path="login" element={<Auth type="login" />} />
				<Route path="register" element={<Auth type="register" />} />
				<Route path="EmailVerifying" element={<ConfirmEmail />} />
				<Route
					path="profile"
					element={<Navigate to={`/profile/${getUserName()}`} />}
				/>
				<Route path="profile/:userName" element={<Profile />} />
				<Route path="user/:userName" element={<Profile />} />
				<Route path="blogger/:userName" element={<Profile />} />
				<Route path="new" element={<NewBlog />} />

				<Route path="blog">
					<Route path=":id" element={<BlogDetails />} />
				</Route>

				<Route path="*" element={<NotFound />} />
			</Route>
		)
	);

	return (
		<Context>
			<Suspense fallback={<Loading />}>
				<RouterProvider router={router} />
			</Suspense>
		</Context>
	);
}

export default App;

const getUserName = async () => {
	if (!auth.currentUser) return undefined;
	const docRef = doc(db, "users", auth.currentUser.uid);
	const docSnap = await getDoc(docRef);
	return docSnap.data()?.userName;
};

export const Loading = () => {
	return createPortal(
		<div className="fixed inset-0 z-50 flex items-center justify-center dark:bg-slate-800">
			<ImSpinner6 className="animate-spin text-5xl text-primary-500 ease-in-out" />
		</div>,
		document.getElementById("portal")!
	);
};
