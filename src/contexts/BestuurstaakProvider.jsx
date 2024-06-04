import {createContext, useCallback, useContext, useEffect, useMemo, useState} from "react";
import {axios} from "../api";
import {useBestuurBestuurstaken} from "./BestuurslidBestuurtaakProvider";

export const BestuurstakenContext = createContext();
export const useBestuurstaken     = () => useContext(BestuurstakenContext);

export const BestuurstaakProvider = ({children}) => {
	const [initialLoad, setInitialLoad]                 = useState(false);
	const [error, setError]                             = useState();
	const [loading, setLoading]                         = useState(false);
	const [currentBestuurstaak, setCurrentBestuurstaak] = useState({});
	const [bestuurstaken, setBestuurstaken]             = useState([]);

	const {refreshBestuurBestuurstaken} = useBestuurBestuurstaken();

	const refreshBestuurstaken = useCallback(async () => {
		try {
			setError();
			setLoading(true);
			const {data} = await axios.get("/bestuurstaken");
			setBestuurstaken(data.data);
			return data.data;
		}
		catch (error) {
			setError(error);
		}
		finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		if (!initialLoad) {
			refreshBestuurstaken();
			setInitialLoad(true);
		}
	}, [initialLoad, refreshBestuurstaken]);

	const createOrUpdateBestuurstaak = useCallback(async ({
															  id,
															  name,
															  description,
															  isSiteAdmin,
														  }) => {
		setError();
		setLoading(true);
		let data   = {
			name,
			description,
			isSiteAdmin,
		};
		let method = id ? "put" : "post";
		let url    = `/bestuurstaken/${id ?? ""}`;
		try {
			const {changedBestuurstaak} = await axios({
														  method,
														  url,
														  data,
													  });
			await refreshBestuurstaken();
			return changedBestuurstaak;
		}
		catch (error) {
			setError(error);
		}
		finally {
			setLoading(false);
		}
	}, [refreshBestuurstaken]);

	const deleteBestuurstaak = useCallback(async (id) => {
		setLoading(true);
		setError();
		try {
			const {data} = await axios({
										   method: "delete",
										   url:    `/bestuurstaken/${id}`,
									   });
			refreshBestuurstaken();
			refreshBestuurBestuurstaken();
			return data;
		}
		catch (error) {
			setError(error);
		}
		finally {
			setLoading(false);
		}
	}, [refreshBestuurstaken, refreshBestuurBestuurstaken]);

	const setBestuurstaakToUpdate = useCallback((id) => {
		setCurrentBestuurstaak(id === null ? null : bestuurstaken.find((bestuurstaak) => bestuurstaak.id === id));
	}, [setCurrentBestuurstaak, bestuurstaken]);

	const value = useMemo(() => ({
		currentBestuurstaak,
		setCurrentBestuurstaak,
		setBestuurstaakToUpdate,
		bestuurstaken,
		error,
		loading,
		createOrUpdateBestuurstaak,
		deleteBestuurstaak,
	}), [currentBestuurstaak, setCurrentBestuurstaak, setBestuurstaakToUpdate, bestuurstaken, error, loading, createOrUpdateBestuurstaak, deleteBestuurstaak]);

	return (<BestuurstakenContext.Provider value={value}>
		{children}
	</BestuurstakenContext.Provider>);
};