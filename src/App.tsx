import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from "react-router-dom";
import Context from "./Context";
import Auth, { ConfirmEmail } from "./pages/Auth";
import Home from "./pages/Home";
import NewBlog from "./pages/NewBlog";
import BlogDetails from "./pages/BlogDetails";
import NotFound from "./pages/NotFound";
import Root from "./pages/Root";

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
			<RouterProvider router={router} />
		</Context>
	);
}

export default App;
