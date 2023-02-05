import Button from "./Button";

type Props = {
	title?: string;
	text?: string;
	buttonText?: string;
	onClick?: () => void;
	secondButtonText?: string;
	secondOnClick?: () => void;
};

function Alert({ title = "Alert", text = "", buttonText = "Ok", onClick, secondButtonText, secondOnClick }: Props) {
	return (
		<section>
			<div
				className="relative space-y-2 rounded border border-dashed border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-4"
				role="alert"
			>
				<h2 className="text-xl font-bold">{title}</h2>
				<p>{text}</p>
				<div className="flex gap-2">
					{(buttonText || onClick) && (
						<Button variant="primary" children={buttonText} onClick={onClick} />
					)}
					{(secondButtonText || secondOnClick) && (
						<Button children={secondButtonText} onClick={secondOnClick} />
					)}
				</div>
			</div>
		</section>
	);
}

export default Alert;
