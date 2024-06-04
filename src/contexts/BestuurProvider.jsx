import {createContext, useCallback, useContext, useEffect, useMemo, useState} from "react";
import {axios} from "../api";

export const BestuurContext = createContext();
export const useBestuur     = () => useContext(BestuurContext);

export const BestuurProvider = ({children}) => {
	const [initialLoad, setInitialLoad]               = useState(false);
	const [currentBestuurslid, setCurrentBestuurslid] = useState({});
	const [error, setError]                           = useState();
	const [loading, setLoading]                       = useState(false);
	const [bestuur, setBestuur]                       = useState([]);

	const refreshBestuur = useCallback(async () => {
		try {
			setError();
			setLoading(true);
			const {data} = await axios.get("/bestuur");
			setBestuur(data.data);
			return data.data;
		}
		catch (error) {
			setError(error);
		}
		finally {
			setLoading(false);
		}
	}, [setError, setLoading, setBestuur]);

	useEffect(() => {
		if (!initialLoad) {
			refreshBestuur();
			setInitialLoad(true);
		}
	}, [initialLoad, refreshBestuur]);

	const createOrUpdateBestuur = useCallback(async ({
														 id,
														 firstName,
														 lastName,
														 password,
													 }) => {
		setError();
		setLoading(true);
		let data   = {
			firstName,
			lastName,
			password,
		};
		let method = id ? "put" : "post";
		let url    = `/bestuur/${id ?? "register"}`;
		try {
			const {changedBestuurslid} = await axios({
														 method,
														 url,
														 data,
													 });
			await refreshBestuur();
			return changedBestuurslid;
		}
		catch (error) {
			console.error(error);
			throw error;
		}
		finally {
			setLoading(false);
		}
	}, [refreshBestuur]);

	const deleteBestuurslid = useCallback(async (id) => {
		setLoading(true);
		setError();
		try {
			const {data} = await axios({
										   method: "delete",
										   url:    `/bestuur/${id}`,
									   });
			refreshBestuur();
			return data;
		}
		catch (error) {
			console.error(error);
			throw error;
		}
		finally {
			setLoading(false);
		}
	}, [refreshBestuur]);

	const setBestuurslidToUpdate = useCallback((id) => {
		setCurrentBestuurslid(id === null ? null : bestuur.find((bestuurslid) => bestuurslid.id === id));
	}, [setCurrentBestuurslid, bestuur]);

	const value = useMemo(() => ({
		currentBestuurslid,
		setCurrentBestuurslid,
		setBestuurslidToUpdate,
		bestuur,
		error,
		loading,
		createOrUpdateBestuur,
		deleteBestuurslid,
	}), [currentBestuurslid, setCurrentBestuurslid, setBestuurslidToUpdate, bestuur, error, loading, createOrUpdateBestuur, deleteBestuurslid]);

	return (<BestuurContext.Provider value={value}>
		{children}
	</BestuurContext.Provider>);
};