import React, { MutableRefObject, useContext, useRef, useState } from "react";
import { marked } from "marked";
import { sanitize } from "./../HOCs/sanitize";
import { BiHide, BiShowAlt } from "react-icons/bi";
import {
	BsChatRightQuote,
	BsImage,
	BsLink45Deg,
	BsListOl,
	BsListUl,
	BsTypeBold,
	BsTypeH1,
	BsTypeH2,
	BsTypeItalic,
	BsTypeStrikethrough,
	BsUiChecks,
} from "react-icons/bs";
import { AppContext } from "../Context";
import UploadImage from "./UploadImage";
import { Loading } from "../App";
import Input from "./Input";
import Button from "./Button";

type Props = {
	value: string;
	setValue: React.Dispatch<React.SetStateAction<string>>;
	className?: string;
};

export default function MdEditor({ value, setValue, className }: Props) {
	const [isPreview, setIsPreview] = useState(true);
	const textarea = useRef() as MutableRefObject<HTMLTextAreaElement>;
	const [moreOptions, setMoreOptions] = useState<JSX.Element | null>();

	const { openModal } = useContext(AppContext);

	marked.setOptions({
		gfm: true,
		breaks: true,
	});

	const text = marked(sanitize(value));

	const handleLink = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		setValue(
			(val) => val + `[${e.currentTarget.link}](${e.currentTarget.text})`
		);
		setMoreOptions(null);
	};

	return (
		<div className={`grid-cols-2 md:grid ${className}`}>
			<div className="relative flex flex-col overflow-hidden rounded border border-dashed border-slate-400/50">
				{/* Options */}
				<div className="sticky top-0 left-0 z-10 w-full bg-slate-100 px-3 py-1 font-bold dark:bg-slate-700">
					<div className="flex items-center justify-start gap-3 [&>svg]:h-6 [&>svg]:cursor-pointer [&>svg:hover]:text-primary-500">
						<BsTypeH1
							title="Heading large"
							onClick={() => {
								setValue((val) => val + `\n# `);
							}}
						/>
						<BsTypeH2
							title="Heading extra large"
							onClick={() => {
								setValue((val) => val + `\n### `);
							}}
						/>
						<BsTypeBold
							title="Font Bold"
							onClick={() => {
								setValue((val) => val + ` **Text** `);
							}}
						/>
						<BsTypeItalic
							title="Font Italic"
							onClick={() => {
								setValue((val) => val + ` _Text_ `);
							}}
						/>
						<BsTypeStrikethrough
							title="Font Strike throuogh"
							onClick={() => {
								setValue((val) => val + ` ~Text~ `);
							}}
						/>
						<BsImage
							title="Image"
							onClick={() => {
								setMoreOptions(
									<div className="py-2">
										<UploadImage
											path="images"
											name={`${Math.random().toString(32).slice(2)}`}
											onLoading={() => {
												return <Loading />;
											}}
											onSuccess={(url) => {
												console.log(url);
												setValue((val) => val + `![Image](${url})`);
												setMoreOptions(null);
											}}
										/>
									</div>
								);
							}}
						/>
						<BsLink45Deg
							title="Link"
							onClick={() => {
								setMoreOptions(
									<form
										className="flex flex-col gap-2 py-2"
										onSubmit={handleLink}
									>
										<input
											name="link"
											className="w-full rounded bg-white p-2 py-1 font-normal dark:bg-slate-900"
											defaultValue="https://"
											placeholder="Link"
										/>
										<input
											name="text"
											className="w-full rounded bg-white p-2 py-1 font-normal dark:bg-slate-900"
											defaultValue="Link text"
											placeholder="Text"
										/>
										<Button
											className="w-full"
											variant="primary"
											type="submit"
										>
											Add
										</Button>
									</form>
								);
							}}
						/>
						<BsListUl
							title="Unordered list"
							onClick={() => {
								setValue(
									(val) =>
										val + `\n- List Item.\n- List Item.\n- etc...\n`
								);
							}}
						/>
						<BsListOl
							title="Ordered list"
							onClick={() => {
								setValue(
									(val) =>
										val + `\n1. List Item.\n2. List Item\n3. etc...\n`
								);
							}}
						/>
						<BsUiChecks
							title="Checks list"
							onClick={() => {
								console.log(value);
								setValue(
									(val) => val + `\n- [x] Done.\n- [ ] Not Yet.\n`
								);
							}}
						/>
						<BsChatRightQuote
							title="Quote"
							onClick={() => {
								console.log(value);
								setValue((val) => val + `\n> Text.\n`);
							}}
						/>

						{!isPreview && (
							<BiShowAlt
								title="Show Preview"
								onClick={() => setIsPreview(true)}
							/>
						)}
					</div>
					{moreOptions && <div>{moreOptions}</div>}
				</div>
				{/* Text input */}
				<textarea
					className="h-full min-h-[50vh] w-full flex-auto resize-none border-none bg-transparent p-2"
					value={value}
					onChange={(e) => setValue(e.target.value)}
					ref={textarea}
					onInput={(el) => {
						el.currentTarget.style.height = `${el.currentTarget.scrollHeight}px`;
					}}
				></textarea>
			</div>
			{/* Preview */}
			{isPreview && (
				<div className="overflow-hidden rounded border border-dashed border-slate-400/50 bg-transparent">
					<header className="flex items-center justify-between bg-slate-100 px-3 py-1 font-bold dark:bg-slate-700">
						<span>Preview:</span>
						<BiHide
							title="Show Preview"
							onClick={() => setIsPreview(false)}
						/>
					</header>
					<div
						dangerouslySetInnerHTML={{
							// __html: marked.parse(value.replace(/(<.+>)/gm, "`$1`")),
							__html: text,
						}}
						className="prose p-2"
						onClick={() => textarea.current.focus()}
					></div>
				</div>
			)}
		</div>
	);
}
