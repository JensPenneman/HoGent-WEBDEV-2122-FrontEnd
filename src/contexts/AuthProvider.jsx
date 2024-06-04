import config from "../config.json";
import {createContext, useCallback, useContext, useEffect, useMemo, useState} from "react";
import * as api from "../api";
import * as bestuurAPI from "../api/bestuur";
import {useBestuurBestuurstaken} from "./BestuurslidBestuurtaakProvider";

const JWT_TOKEN_KEY = config.token_key;
const AuthContext   = createContext();

function parseJWT(token) {
	if (!token) return {};
	const base64URL   = token.split(".")[1];
	const payload     = Buffer.from(base64URL, "base64");
	const jsonPayload = payload.toString("ascii");
	return JSON.parse(jsonPayload);
}

function parseExp(exp) {
	if (!exp) return null;
	if (typeof exp !== "number") exp = Number(exp);
	if (isNaN(exp)) return null;
	return new Date(exp * 1000);
}

const useAuth = () => useContext(AuthContext);

export const useSession = () => {
	const {
			  token,
			  bestuurslid,
			  ready,
			  loading,
			  error,
			  isSiteAdmin,
		  } = useAuth();
	return {
		token,
		bestuurslid,
		ready,
		loading,
		error,
		isAuthed:    Boolean(token),
		isSiteAdmin: isSiteAdmin(),
	};
};

export const useLogin  = () => {
	const {login} = useAuth();
	return login;
};
export const useLogout = () => {
	const {logout} = useAuth();
	return logout;
};

export const AuthProvider = ({children}) => {
	const [ready, setReady]             = useState(false);
	const [loading, setLoading]         = useState(false);
	const [error, setError]             = useState("");
	const [token, setToken]             = useState(localStorage.getItem(JWT_TOKEN_KEY));
	const [bestuurslid, setBestuurslid] = useState(null);

	const {bestuurBestuurstaken}                                        = useBestuurBestuurstaken();
	const [bestuurstakenVanBestuurslid, setBestuurstakenVanBestuurslid] = useState([]);

	useEffect(() => {
		if (bestuurslid) {
			setBestuurstakenVanBestuurslid(bestuurBestuurstaken
											   .filter((bestuurslidBestuurstaak) => bestuurslidBestuurstaak.bestuurslid.id === bestuurslid.id));
		}
		else {
			setBestuurstakenVanBestuurslid([]);
		}
	}, [bestuurslid, bestuurBestuurstaken, setBestuurstakenVanBestuurslid]);

	const setSession = useCallback(async (token, bestuurslid) => {
		const {
				  exp,
				  bestuurslidId,
			  } = parseJWT(token);


		const expiry     = parseExp(exp);
		const stillValid = expiry >= new Date();
		if (stillValid) {
			localStorage.setItem(JWT_TOKEN_KEY, token);
		}
		else {
			localStorage.removeItem(JWT_TOKEN_KEY);
			token = null;
		}


		api.setAuthToken(token);
		setToken(token);
		setReady(token && stillValid);

		if (!bestuurslid && stillValid) {
			bestuurslid = await bestuurAPI.getBestuurslidById(bestuurslidId);
		}
		setBestuurslid(bestuurslid);
	}, []);

	useEffect(() => {
		setSession(token);
	}, [setSession, token]);

	const login = useCallback(async (mail, password) => {
		try {
			setLoading(true);
			setError(null);
			const {
					  token,
					  bestuurslid,
				  } = await bestuurAPI.login(mail, password);
			await setSession(token, bestuurslid);
			return true;
		}
		catch (error) {
			console.error(error);
			setError(`Log in is mislukt, probeer opnieuw`);
			return false;
		}
		finally {
			setLoading(false);
		}
	}, [setSession]);

	const logout = useCallback(() => {
		setSession(null, null);
	}, [setSession]);

	const isSiteAdmin = useCallback(() => {
		return Boolean(bestuurstakenVanBestuurslid
						   .map((bestuurstaak) => Boolean(bestuurstaak.bestuurstaak.isSiteAdmin))
						   .includes(true));
	}, [bestuurstakenVanBestuurslid]);

	const value = useMemo(() => ({
		token,
		bestuurslid,
		ready,
		loading,
		error,
		login,
		logout,
		isSiteAdmin,
	}), [token, bestuurslid, ready, loading, error, login, logout, isSiteAdmin]);

	return (<AuthContext.Provider value={value}>
		{children}
	</AuthContext.Provider>);
};