import {Fragment} from "react";
import {Avatar, Box, Button, CssBaseline, Typography} from "@mui/material";
import {GrDocumentMissing} from "react-icons/all";
import {NavLink} from "react-router-dom";

export default function Error404() {
	return (<Fragment>
		<CssBaseline />
		<Box
			sx={{
				marginTop:     30,
				display:       "flex",
				flexDirection: "column",
				alignItems:    "center",
			}}
		>
			<Avatar sx={{
				m:       1,
				bgcolor: "secondary",
			}}>
				<GrDocumentMissing />
			</Avatar>
			<Typography component="h1" variant="h5">
				Deze pagina is niet te vinden!
			</Typography>
			<NavLink to="/" style={{
				textDecoration: "inherit",
				color:          "inherit",
			}}>
				<Button>
					Ga terug naar de startpagina...
				</Button>
			</NavLink>
		</Box>
	</Fragment>);
}