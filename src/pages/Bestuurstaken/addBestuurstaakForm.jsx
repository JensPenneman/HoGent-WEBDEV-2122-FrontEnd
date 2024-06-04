import {useBestuurBestuurstaken} from "../../contexts/BestuurslidBestuurtaakProvider";
import {useNavigate, useParams} from "react-router";
import {Fragment, useCallback, useEffect, useState} from "react";
import {
	Box,
	Button,
	Container,
	CssBaseline,
	Fade,
	FormControl,
	InputLabel,
	MenuItem,
	Modal,
	Select,
	Typography,
} from "@mui/material";
import {NavLink} from "react-router-dom";
import {useBestuurstaken} from "../../contexts/BestuurstaakProvider";
import ErrorSnack from "../../components/ErrorSnack";

export default function AddBestuurstaakForm() {
	const {
			  loading,
			  error,
			  bestuurBestuurstaken,
			  refreshBestuurBestuurstaken,
			  createOrUpdateBestuurBestuurstaak,
		  }               = useBestuurBestuurstaken();
	const {bestuurstaken} = useBestuurstaken();
	const navigate        = useNavigate();
	const params          = useParams();

	const bestuurslid_id                                          = params.id;
	const [beschikbareBestuurstaken, setBeschikbareBestuurstaken] = useState([]);

	useEffect(() => {
		setBeschikbareBestuurstaken(
			bestuurstaken.filter((bestuurstaak) =>
									 !bestuurBestuurstaken
										 .filter((bestuurstaakVanLid) => bestuurstaakVanLid.bestuurslid.id === bestuurslid_id)
										 .map((bestuurstaakVanLid) => bestuurstaakVanLid.bestuurstaak.id)
										 .includes(bestuurstaak.id),
			),
		);

	}, [bestuurstaken, bestuurBestuurstaken, bestuurslid_id]);

	const handleSubmit                      = (event) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		handleSaveBestuurslidBestuurstaak({bestuurstaak_id: data.get("bestuurstaak_id")});
	};
	const handleSaveBestuurslidBestuurstaak = useCallback(async ({
																	 bestuurstaak_id,
																 }) => {
		const succes = await createOrUpdateBestuurBestuurstaak({
																   bestuurslid_id,
																   bestuurstaak_id,
															   });
		if (succes) {
			refreshBestuurBestuurstaken();
			navigate("../");
		}
	}, [navigate, bestuurslid_id, createOrUpdateBestuurBestuurstaak, refreshBestuurBestuurstaken]);

	return (
		<Fragment>
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
								Bestuurstaak toevoegen
							</Typography>
							<Box
								component="form"
								onSubmit={handleSubmit}
								sx={{
									mt: 1,
									mx: 2,
								}}
							>
								<FormControl fullWidth disabled={beschikbareBestuurstaken.length === 0}>
									<InputLabel id="bestuurstaak_id">Bestuurstaak</InputLabel>
									<Select
										labelId="bestuurstaak_id"
										id="bestuurstaak_id"
										label="Bestuurstaak"
										name="bestuurstaak_id"
										required
									>
										{
											beschikbareBestuurstaken.map((bestuurstaak) => {
												return (
													<MenuItem key={bestuurstaak.id}
															  value={bestuurstaak.id}>{bestuurstaak.name}</MenuItem>);
											})
										}
									</Select>
								</FormControl>
								<Button
									disabled={Boolean(loading) || beschikbareBestuurstaken.length === 0}
									type="submit"
									fullWidth
									variant="contained"
									sx={{
										mt: 3,
										mb: 2,
									}}
								>
									voeg toe
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
		</Fragment>
	);
}