import React, { MutableRefObject, useContext, useRef, useState } from "react";
import { marked, Renderer } from "marked";
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
	const [moreOptions, setMoreOptions] = useState<null | JSX.Element>(null);

	// TODO: Disable auto link in marked
	const renderer = new Renderer();
	renderer.link = (href, title, text) => {
		return `<a href="${href}" title="${title}">${text}</a>`;
	};

	marked.setOptions({
		gfm: true,
		breaks: true,
		smartLists: true,
		smartypants: true,
		renderer: renderer
	});

	const text = marked(sanitize(value));

	return (
		<div className={`grid grid-cols-1 gap-2 md:grid-cols-3 ${className}`}>
			{/* Editor */}
			<div
				className={`relative col-span-2 flex flex-col overflow-hidden rounded border border-dashed border-slate-400/50 ${
					!isPreview && "col-span-3"
				}`}
			>
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
									<UploadImage
										path="images"
										name={`${Math.random().toString(32).slice(2)}`}
										onLoading={() => {
											return <Loading />;
										}}
										onSuccess={(url) => {
											setValue((val) => val + `![Image](${url})`);
											setMoreOptions(null);
										}}
									/>
								);
							}}
						/>
						<BsLink45Deg
							title="Link"
							onClick={() => {
								setMoreOptions(
									<form
										className="space-y-2"
										onSubmit={(e) => {
											e.preventDefault();
											const data = new FormData(
												e.target as HTMLFormElement
											);
											setValue(
												(val) =>
													val +
													` [${data.get("text")}](${data.get(
														"link"
													)}) `
											);
											setMoreOptions(null);
										}}
									>
										<Input
											placeholder="Link"
											name="link"
											defaultValue="https://www.example.com"
											icon={<BsLink45Deg />}
										/>
										<Input
											placeholder="Text"
											name="text"
											defaultValue="read more"
											icon={<BsTypeItalic />}
										/>
										<Button variant="primary" type="submit">
											Add Link
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
								setValue(
									(val) => val + `\n- [x] Done.\n- [ ] Not Yet.\n`
								);
							}}
						/>
						<BsChatRightQuote
							title="Quote"
							onClick={() => {
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
					{moreOptions && <div className="py-2">{moreOptions}</div>}
				</div>
				{/* Text input */}
				<textarea
					className="h-full min-h-[50vh] w-full flex-auto resize-none border-none bg-transparent p-2"
					value={value}
					onChange={(e) => setValue(e.target.value)}
					onClick={() => setMoreOptions(null)}
					ref={textarea}
					onInput={(el) => {
						el.currentTarget.style.height = `${el.currentTarget.scrollHeight}px`;
					}}
				></textarea>
			</div>
			{/* Preview */}
			{isPreview && (
				<div className="overflow-hidden rounded border border-dashed border-slate-400/50 bg-transparent">
					<header className="flex items-center justify-between bg-slate-100 px-3 py-1 font-bold dark:bg-slate-700  [&>svg]:h-6 [&>svg]:cursor-pointer [&>svg:hover]:text-primary-500">
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
						className="prose prose-sm h-full p-2"
						onClick={() => textarea.current.focus()}
					></div>
				</div>
			)}
		</div>
	);
}
