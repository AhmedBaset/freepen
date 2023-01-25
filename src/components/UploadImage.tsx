import {
	useState,
	useEffect,
	useRef,
	useContext,
	Dispatch,
	SetStateAction,
	memo,
} from "react";
import { AppContext } from "../Context";
import { BiImageAdd } from "react-icons/bi";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "../firebase-config";
import Button from "./Button";

enum ImageStateLevel {
	waitImage = "Upload thumbnail image",
	uploading = "Uploading...",
	error = "Error",
	gotURL = "getUrl",
}

type ImageStateProps = {
	state: ImageStateLevel;
	progress: number;
	url: string;
	details: string;
};

function UploadImage({
	id,
	setImageLink,
}: {
	id: string;
	setImageLink: Dispatch<SetStateAction<string>>;
}) {
	const [imageState, setImageState] = useState<ImageStateProps>({
		state: ImageStateLevel.waitImage,
		progress: 0,
		url: "",
		details: "",
	});
	const imageRef = useRef() as React.MutableRefObject<HTMLInputElement>;

	const { newError } = useContext(AppContext);

	useEffect(() => {
		setImageLink(() => imageState.url);
	}, [imageState.url]);

	async function uploadImage() {
		const pathRef = ref(storage, `blogsThumbnails/${id}`);

		if (!imageRef.current.files) return;

		const uploadTask = await uploadBytesResumable(
			pathRef,
			imageRef?.current?.files[0]
		);

		uploadTask.task.on(
			"state_changed",
			(snapshoot) => {
				const progress =
					(snapshoot.bytesTransferred / snapshoot.totalBytes) * 100;

				setImageState((v) => ({
					...v,
					state: ImageStateLevel.uploading,
					progress,
					url: "",
					details: "",
				}));
			},
			(err) => {
				setImageState((v) => ({
					...v,
					state: ImageStateLevel.error,
					url: "",
					details: err.message,
				}));
				newError(err || { message: "Error while uploading image" });
			},
			() => {
				getDownloadURL(pathRef)
					.then((url) => {
						setImageState((v) => ({
							...v,
							state: ImageStateLevel.gotURL,
							url,
							details: "Uploaded",
						}));
					})
					.catch((err) => {
						newError(err || { message: "Error while getting image url" });
						setImageState((v) => ({
							...v,
							state: ImageStateLevel.error,
							url: "",
							details: err.message,
						}));
					});
			}
		);
	}

	return (
		<>
			{imageState.state === ImageStateLevel.waitImage ? (
				<Button className="relative w-full">
					<span className="pointer-events-none flex items-center gap-3">
						<BiImageAdd className="text-lg text-primary-500" /> Upload
						Thumbnail Image
					</span>
					<input
						type="file"
						accept="image/*"
						ref={imageRef}
						className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
						onChange={uploadImage}
						// onChange={(e) => setImage(e.target.files![0])}
					/>
				</Button>
			) : imageState.state === ImageStateLevel.uploading ? (
				<div className="bg-slage-400/50 relative flex h-12 items-center justify-center">
					<div
						className="absolute left-0 h-full bg-primary-500"
						style={{ width: `${imageState.progress}%` }}
					></div>
					<span>Uploading... {imageState.progress}%</span>
				</div>
			) : imageState.state === ImageStateLevel.gotURL ? (
				<>
					<img
						src={imageState.url}
						className="object-fit aspect-video w-full rounded object-center ring-2 ring-primary-500"
						alt="Thumbnail Image"
					/>
					<Button className="relative w-full">
						<span className="pointer-events-none flex items-center gap-3">
							<BiImageAdd className="text-lg text-primary-500" /> Upload
							another Image
						</span>
						<input
							type="file"
							accept="image/*"
							ref={imageRef}
							className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
							onChange={uploadImage}
						/>
					</Button>
				</>
			) : imageState.state === ImageStateLevel.error ? (
				<>
					<div>
						<span className="font-bold">Error:</span>
						{imageState.details}
					</div>
					<Button className="relative w-full">
						<span className="pointer-events-none flex items-center gap-3">
							<BiImageAdd className="text-lg text-primary-500" /> Upload
							another Image
						</span>
						<input
							type="file"
							accept="image/*"
							ref={imageRef}
							className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
							onChange={uploadImage}
						/>
					</Button>
				</>
			) : (
				<></>
			)}
		</>
	);
}

export default memo(UploadImage);
