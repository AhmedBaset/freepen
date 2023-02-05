import { useLayoutEffect, useState } from "react";
import {
	collection,
	getDocs,
	query,
	QueryLimitConstraint,
	QueryOrderByConstraint,
	QueryStartAtConstraint,
	QueryFieldFilterConstraint,
	limit,
} from "firebase/firestore";
import { db } from "../firebase-config";

export function useGetDocs<Type>(
	path: string,
	{ limit: limitNum = 1000}: { limit?: number } = {limit: 1000},
	...options:
		| (
				| QueryFieldFilterConstraint
				| QueryOrderByConstraint
				| QueryLimitConstraint
				| QueryStartAtConstraint
		  	)[]
		| []
) {
	const [docs, setDocs] = useState<Type[]>([]);
	const [error, setError] = useState<any>();
	const [loading, setLoading] = useState(true);

	
	useLayoutEffect(() => {
		(async () => {
			console.log("RUNNING");
			try {
				const q = query(collection(db, path), limit(limitNum), ...options);
				const snapshot = await getDocs(q);
				if (snapshot.empty) return;
				const data = snapshot.docs.map((doc) => ({
					...(doc.data() as Type),
				}));
				setDocs(data);
				setLoading(false);
			} catch (error) {
				setError(error);
				setLoading(false);
			}
		})();
	}, [limitNum]);

	return [docs, error, loading];
}
