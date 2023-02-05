import React from "react";
import { BiSearchAlt } from "react-icons/bi";
import Input from "../components/Input";
import { Blog } from "../TYPES";

function Search() {
   const [searchWords, setSearchWords] = React.useState("");
   const [results, setResults] = React.useState<Blog[]>([])

   React.useEffect(() => {
      const keywords = searchWords.split(" ");


   }, [searchWords])

	return (
		<div className="container space-y-3 p-3">
			<div className="flex">
				<input
					className="flex-auto rounded bg-slate-50 p-2 pl-10 ring-1 ring-slate-300 dark:ring-slate-700 transition duration-300 focus:ring-primary-400
					dark:bg-slate-800"
					type="text"
            />
            <BiSearchAlt className="" />
			</div>
		</div>
	);
}

export default Search;
