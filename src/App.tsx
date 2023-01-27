import { Suspense } from "react";
import { createPortal } from "react-dom";
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from "react-router-dom";
import { ImSpinner6 } from "react-icons/im";
// import Context from "./Context";
// import Auth, { ConfirmEmail } from "./pages/Auth";
// import Home from "./pages/Home";
// import NewBlog from "./pages/NewBlog";
// import BlogDetails from "./pages/BlogDetails";
// import NotFound from "./pages/NotFound";
// import Root from "./pages/Root";

import { lazy } from "react";

const Context = lazy(() => import("./Context"));
const Root = lazy(() => import("./pages/Root"));
const Home = lazy(() => import("./pages/Home"));
const Auth = lazy(() => import("./pages/Auth"));
const ConfirmEmail = lazy(() =>
	import("./pages/Auth").then((module) => ({
		default: module.ConfirmEmail,
	}))
);
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

export const Loading = () => {
	return createPortal(
		<div className="fixed inset-0 z-50 dark:bg-slate-800 flex items-center justify-center">
			<ImSpinner6 className="animate-spin ease-in-out text-5xl text-primary-500" />
		</div>,
		document.getElementById("portal")!
	);
};
