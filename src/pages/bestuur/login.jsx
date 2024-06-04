import {Fragment, useCallback, useEffect} from "react";
import {Avatar, Box, Button, CssBaseline, TextField, Typography} from "@mui/material";
import {useLogin, useSession} from "../../contexts/AuthProvider";
import {MdLock} from "react-icons/all";
import {useNavigate} from "react-router";
import ErrorSnack from "../../components/ErrorSnack";

export default function Login() {
	const navigate = useNavigate();
	const {
			  loading,
			  error,
			  isAuthed,
		  }        = useSession();
	const login    = useLogin();

	const handleSubmit = (event) => {
		event.preventDefault();
		const data = new FormData(event.currentTarget);
		handleLogin({
						email:    data.get("email"),
						password: data.get("password"),
					});
	};
	const handleLogin  = useCallback(async ({
												email,
												password,
											}) => {
		const succes = await login(email, password);
		if (succes) {
			navigate("/", {replace: true});
		}
	}, [navigate, login]);

	useEffect(() => {
		if (isAuthed) {
			navigate(-1, {replace: true});
			return <Typography>Logged in already</Typography>;
		}
	}, [isAuthed, navigate]);

	return (<Fragment>
		<CssBaseline />
		<Box
			sx={{
				marginTop:     15,
				display:       "flex",
				flexDirection: "column",
				alignItems:    "center",
			}}
		>
			<Avatar sx={{
				m:       1,
				bgcolor: "error.main",
			}}>
				<MdLock />
			</Avatar>
			<Typography component="h1" variant="h5">
				Log in
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
					id="email"
					label="Mail adres"
					name="email"
					autoComplete="username"
					type="email"
					inputMode="email"
					autoFocus
				/>
				<TextField
					margin="normal"
					required
					fullWidth
					id="password"
					label="Wachtwoord"
					name="password"
					autoComplete="current-password"
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
						mt: 3,
						mb: 2,
					}}
				>
					Log in
				</Button>
			</Box>
		</Box>
		<ErrorSnack error={error} />
	</Fragment>);
}