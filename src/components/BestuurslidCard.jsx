import {memo, useCallback} from "react";
import {Card, CardActions, CardContent, IconButton, Typography} from "@mui/material";
import {useBestuur} from "../contexts/BestuurProvider";
import {IoPersonRemove, MdEdit} from "react-icons/all";
import {useLogout, useSession} from "../contexts/AuthProvider";
import BestuurstakenList from "./BestuurstakenList";
import {useNavigate} from "react-router";

const BestuurslidCard = memo(({
								  id,
								  firstName,
								  lastName,
							  }) => {
	const {deleteBestuurslid} = useBestuur();
	const {
			  bestuurslid,
			  isAuthed,
			  isSiteAdmin,
		  }                   = useSession();
	const logout              = useLogout();
	const navigate            = useNavigate();

	const handleEditBestuurslid   = useCallback(() => {
		if (isSiteAdmin) {
			navigate(`edit/${id}`);
		}
	}, [id, navigate, isSiteAdmin]);
	const handleDeleteBestuurslid = useCallback(() => {
		deleteBestuurslid(id);
		if (isAuthed && bestuurslid.id === id) {
			logout();
		}
	}, [id, deleteBestuurslid, isAuthed, bestuurslid, logout]);

	return (<Card>
		<CardContent>
			<Typography variant="h5" component="div">
				{`${firstName} ${lastName}`}
			</Typography>
			<BestuurstakenList bestuurslid_id={id} />
		</CardContent>
		{isAuthed && <CardActions disableSpacing>
			<IconButton color="primary"
						aria-label="Bewerk bestuurslid"
						component="span"
						disabled={!isSiteAdmin}
						onClick={handleEditBestuurslid}
			>
				<MdEdit />
			</IconButton>
			<IconButton color="error"
						aria-label="Verwijder bestuurslid"
						component="span"
						onClick={handleDeleteBestuurslid}
						disabled={!isSiteAdmin}
			>
				<IoPersonRemove />
			</IconButton>
		</CardActions>}
	</Card>);
});

export default BestuurslidCard;