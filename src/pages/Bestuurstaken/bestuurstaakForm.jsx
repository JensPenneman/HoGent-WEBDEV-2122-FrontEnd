import {useBestuurstaken} from "../../contexts/BestuurstaakProvider";
import {useNavigate, useParams} from "react-router";
import {Fragment, useCallback, useEffect, useState} from "react";
import {
	Box,
	Button,
	Container,
	CssBaseline,
	Fade,
	FormControlLabel,
	Modal,
	Switch,
	TextField,
	Typography,
} from "@mui/material";
import {NavLink} from "react-router-dom";
import ErrorSnack from "../../components/ErrorSnack";

export default function BestuurstaakForm() {
	const {
			  loading,
			  error,
			  currentBestuurstaak,
			  createOrUpdateBestuurstaak,
			  refreshBestuurstaken,
			  setBestuurstaakToUpdate,
		  }        = useBestuurstaken();
	const navigate = useNavigate();
	const params   = useParams();

	const id = params.id;

	const [name, setName]               = useState("");
	const [description, setDescription] = useState("");
	const [isSiteAdmin, setIsSiteAdmin] = useState(false);

	const handleChangeName        = useCallback((event) => {
		setName(event.target.value);
	}, [setName]);
	const handleChangeDescription = useCallback((event) => {
		setDescription(event.target.value);
	}, [setDescription]);
	const handleChangeIsSiteAdmin = useCallback((event) => {
		setIsSiteAdmin(event.target.checked);
	}, [setIsSiteAdmin]);

	useEffect(() => {
		setBestuurstaakToUpdate(id);
		setName(currentBestuurstaak?.name ?? "");
		setDescription(currentBestuurstaak?.description ?? "");
		setIsSiteAdmin(currentBestuurstaak?.isSiteAdmin ?? false);
	}, [id, setBestuurstaakToUpdate, setName, setDescription, setIsSiteAdmin, currentBestuurstaak]);


	const handleSubmit           = (event) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		handleSaveBestuurstaak({
								   id,
								   name:        data.get("name"),
								   description: data.get("description"),
								   isSiteAdmin: data.get("isSiteAdmin") === "on",
							   });
	};
	const handleSaveBestuurstaak = useCallback(async ({
														  id,
														  name,
														  description,
														  isSiteAdmin,
													  }) => {
		const succes = await createOrUpdateBestuurstaak({
															id,
															name,
															description,
															isSiteAdmin,
														});
		if (succes) {
			refreshBestuurstaken();
			navigate(-1);
		}
	}, [navigate, createOrUpdateBestuurstaak, refreshBestuurstaken]);


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
					}}
				>
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
						<Typography component="h1" variant="h5">
							Bestuurstaak
						</Typography>
						<Box
							component="form"
							onSubmit={handleSubmit}
							sx={{
								mt: 1,
								mx: 2,
							}}
						>
							<TextField
								margin="normal"
								required
								fullWidth
								id="name"
								label="Naam"
								name="name"
								autoComplete="off"
								type="text"
								inputMode="text"
								autoFocus
								value={name}
								onChange={handleChangeName}
							/>
							<TextField
								margin="normal"
								required
								fullWidth
								id="description"
								label="Omschrijving"
								name="description"
								autoComplete="off"
								type="text"
								inputMode="text"
								value={description}
								onChange={handleChangeDescription}
							/>
							<FormControlLabel control={<Switch name="isSiteAdmin"
															   checked={Boolean(isSiteAdmin)}
															   onChange={handleChangeIsSiteAdmin} />}
											  label="Is een site administrator" />
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
								{id ? "wijzig" : "voeg toe"}
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