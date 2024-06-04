import {useSession} from "../contexts/AuthProvider";
import {useEffect, useMemo} from "react";
import {useNavigate} from "react-router";

export default function PrivateRoute({
										 children,
										 needsSiteAdmin,
									 }) {
	const {
			  isAuthed,
			  isSiteAdmin,
		  }        = useSession();
	const navigate = useNavigate();

	const canShowRoute = useMemo(() => {
		if (!needsSiteAdmin) return isAuthed;
		return isAuthed && isSiteAdmin;
	}, [isAuthed, isSiteAdmin, needsSiteAdmin]);

	useEffect(() => {
		if (!canShowRoute) {
			navigate("/login", {replace: true});
		}
	}, [canShowRoute, navigate]);

	return (children);
}