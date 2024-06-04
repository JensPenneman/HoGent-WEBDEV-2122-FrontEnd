import {Alert, Snackbar} from "@mui/material";
import {useCallback, useEffect, useState} from "react";

export default function ErrorSnack({error}) {
	const [openSnack, setOpenSnack] = useState(true);
	const handleOpenSnack           = useCallback(() => {
		setOpenSnack(true);
	}, [setOpenSnack]);
	const handleCloseSnack          = useCallback(() => {
		setOpenSnack(false);
	}, [setOpenSnack]);
	useEffect(() => {
		if (error) {
			handleOpenSnack();
		}
	}, [error, handleOpenSnack]);

	if (!error) return null;


	return (<Snackbar open={openSnack} onClose={handleCloseSnack} autoHideDuration={6000}>
		<Alert onClose={handleCloseSnack} severity="error">
			{error}
		</Alert>
	</Snackbar>);
}