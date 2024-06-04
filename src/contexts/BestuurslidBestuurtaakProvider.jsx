import {createContext, useCallback, useContext, useEffect, useMemo, useState} from "react";
import {axios} from "../api";

export const BestuurBestuurstakenContext = createContext();
export const useBestuurBestuurstaken     = () => useContext(BestuurBestuurstakenContext);

export const BestuurslidBestuurtaakProvider = ({children}) => {
	const [initialLoad, setInitialLoad]                   = useState(false);
	const [error, setError]                               = useState();
	const [loading, setLoading]                           = useState(false);
	const [bestuurBestuurstaken, setBestuurBestuurstaken] = useState([]);

	const refreshBestuurBestuurstaken = useCallback(async () => {
		try {
			setError();
			setLoading(true);
			const {data} = await axios.get("/bestuurslid_bestuurstaak");
			setBestuurBestuurstaken(data.data);
			return data.data;
		}
		catch (error) {
			setError(error);
		}
		finally {
			setLoading(false);
		}
	}, [setError, setLoading, setBestuurBestuurstaken]);

	useEffect(() => {
		if (!initialLoad) {
			refreshBestuurBestuurstaken();
			setInitialLoad(true);
		}
	}, [initialLoad, refreshBestuurBestuurstaken]);

	const createOrUpdateBestuurBestuurstaak = useCallback(async ({
																	 id,
																	 bestuurslid_id,
																	 bestuurstaak_id,
																 }) => {
		setError();
		setLoading(true);
		let data   = {
			bestuurslid_id,
			bestuurstaak_id,
		};
		let method = id ? "put" : "post";
		let url    = `/bestuurslid_bestuurstaak/${id ?? ""}`;
		try {
			const {changedBestuurslidBestuurstaak} = await axios({
																	 method,
																	 url,
																	 data,
																 });
			await refreshBestuurBestuurstaken();
			return changedBestuurslidBestuurstaak;
		}
		catch (error) {
			setError(error);
		}
		finally {
			setLoading(false);
		}
	}, [refreshBestuurBestuurstaken, setError, setLoading]);

	const deleteBestuurslidBestuurstaak = useCallback(async (id) => {
		setLoading(true);
		setError();
		try {
			const {data} = await axios({
										   method: "delete",
										   url:    `/bestuurslid_bestuurstaak/${id}`,
									   });
			refreshBestuurBestuurstaken();
			return data;
		}
		catch (error) {
			setError(error);
		}
		finally {
			setLoading(false);
		}
	}, [setLoading, setError, refreshBestuurBestuurstaken]);

	const value = useMemo(() => ({
		loading,
		error,
		bestuurBestuurstaken,
		createOrUpdateBestuurBestuurstaak,
		refreshBestuurBestuurstaken,
		deleteBestuurslidBestuurstaak,
	}), [loading, error, bestuurBestuurstaken, createOrUpdateBestuurBestuurstaak, refreshBestuurBestuurstaken, deleteBestuurslidBestuurstaak]);

	return (<BestuurBestuurstakenContext.Provider value={value}>
		{children}
	</BestuurBestuurstakenContext.Provider>);
};