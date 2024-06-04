import {Fragment, useCallback, useEffect, useState} from "react";
import {useBestuur} from "../../contexts/BestuurProvider";
import {useNavigate, useParams} from "react-router";
import {Avatar, Box, Button, Container, CssBaseline, Fade, Modal, TextField, Typography} from "@mui/material";
import {NavLink} from "react-router-dom";
import ErrorSnack from "../../components/ErrorSnack";

export default function EditBestuurslidForm() {
	const {
			  loading,
			  error,
			  currentBestuurslid,
			  createOrUpdateBestuur,
			  refreshBestuur,
			  setBestuurslidToUpdate,
		  }        = useBestuur();
	const navigate = useNavigate();
	const params   = useParams();

	const id = params.id;

	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName]   = useState("");

	const handleChangeFirstName = (event) => {
		setFirstName(event.target.value);
	};
	const handleChangeLastName  = (event) => {
		setLastName(event.target.value);
	};

	useEffect(() => {
		setBestuurslidToUpdate(id);
		setFirstName(currentBestuurslid?.firstName);
		setLastName(currentBestuurslid?.lastName);
	}, [id, setBestuurslidToUpdate, setFirstName, setLastName, currentBestuurslid]);

	const handleSubmit          = (event) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		handleEditBestuurslid({
								  id,
								  firstName: data.get("firstName"),
								  lastName:  data.get("lastName"),
							  });
	};
	const handleEditBestuurslid = useCallback(async ({
														 id,
														 firstName,
														 lastName,
													 }) => {
		const succes = await createOrUpdateBestuur({
													   id,
													   firstName,
													   lastName,
												   });
		if (succes) {
			refreshBestuur();
			navigate(-1);
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
							Bestuurslid bewerken
						</Typography>
						<Box component="form"
							 onSubmit={handleSubmit}
							 sx={{
								 mt: 1,
								 mx: 2,
							 }}>
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
								value={firstName}
								onChange={handleChangeFirstName}
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
								value={lastName}
								onChange={handleChangeLastName}
							/>
							<Button
								disabled={Boolean(loading)}
								type="submit"
								fullWidth
								variant="contained"
								sx={{
									mt: 3,
									mb: 2,
								}}
							>
								Wijzig
							</Button>
							<NavLink to="../" style={{
								textDecoration: "inherit",
								color:          "inherit",
							}}>
								<Button
									disabled={Boolean(loading)}
									fullWidth
									variant="contained"
									sx={{
										mb: 2,
									}}
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