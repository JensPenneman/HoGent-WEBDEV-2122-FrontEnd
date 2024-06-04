import {Fragment, useCallback} from "react";
import {useBestuur} from "../../contexts/BestuurProvider";
import {useNavigate} from "react-router";
import {Avatar, Box, Button, Container, CssBaseline, Fade, Modal, TextField, Typography} from "@mui/material";
import {NavLink} from "react-router-dom";
import ErrorSnack from "../../components/ErrorSnack";

export default function AddBestuurslidForm() {
	const {
			  loading,
			  error,
			  createOrUpdateBestuur,
			  refreshBestuur,
		  }        = useBestuur();
	const navigate = useNavigate();

	const handleSubmit          = (event) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		handleSaveBestuurslid({
								  firstName: data.get("firstName"),
								  lastName:  data.get("lastName"),
								  password:  data.get("password"),
							  });
	};
	const handleSaveBestuurslid = useCallback(async ({
														 firstName,
														 lastName,
														 password,
													 }) => {
		const succes = await createOrUpdateBestuur({
													   firstName,
													   lastName,
													   password,
												   });
		if (succes) {
			refreshBestuur();
			navigate("../");
		}
	}, [navigate, createOrUpdateBestuur, refreshBestuur]);

	return (<Fragment>
		<CssBaseline />
		<Modal open={true}>
			<Fade in={true}>
				<Container
					sx={{
						position:  "absolute",
						top:       "50%",
						left:      "50%",
						transform: "translate(-50%, -50%)",
						maxWidth:  "100vw",
						maxHeight: "100vh",
					}}>
					<Box
						sx={{
							display:       "flex",
							flexDirection: "column",
							alignItems:    "center",
							bgcolor:       "background.paper",
							border:        "2px solid #000",
							boxShadow:     24,
							p:             4,
						}}
					>
						<Avatar sx={{
							m:       1,
							bgcolor: "error.main",
						}} />
						<Typography component="h1" variant="h5">
							Bestuurslid aanmaken
						</Typography>
						<Box component="form"
							 onSubmit={handleSubmit}>
							<TextField
								margin="normal"
								required
								fullWidth
								id="firstName"
								label="Voornaam"
								name="firstName"
								autoComplete="given-name"
								type="text"
								inputMode="text"
								autoFocus
							/>
							<TextField
								margin="normal"
								required
								fullWidth
								id="lastName"
								label="Achternaam"
								name="lastName"
								autoComplete="family-name"
								type="text"
								inputMode="text"
							/>
							<TextField
								disabled
								margin="normal"
								fullWidth
								id="email"
								label="Email"
								name="email"
								autoComplete="username"
								type="email"
								inputMode="email"
								helperText="Het email-adres wordt op basis van de naam aangemaakt."
							/>
							<TextField
								margin="normal"
								required
								fullWidth
								id="password"
								label="Wachtwoord"
								name="password"
								autoComplete="new-password"
								type="password"
								inputMode="text"
								inputProps={{
									minLength: 8,
									maxLength: 32,
								}}
								helperText="Minimum 8 karakters en maximum 32"
							/>
							<Button
								disabled={Boolean(loading)}
								type="submit"
								fullWidth
								variant="contained"
								sx={{
									mb: 1,
								}}
							>
								Voeg toe
							</Button>
							<NavLink to="../" style={{
								textDecoration: "inherit",
								color:          "inherit",
							}}>
								<Button
									disabled={Boolean(loading)}
									fullWidth
									variant="contained"
								>
									Annuleer
								</Button>
							</NavLink>
						</Box>
					</Box>
				</Container>
			</Fade>
		</Modal>
		<ErrorSnack error={error} />
	</Fragment>);
}