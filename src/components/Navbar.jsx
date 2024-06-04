import {useLogout, useSession} from "../contexts/AuthProvider";
import {useCallback, useEffect, useState} from "react";
import {
	Alert,
	AppBar,
	Avatar,
	Box,
	Button,
	Container,
	IconButton,
	Menu,
	MenuItem,
	Snackbar,
	Toolbar,
	Tooltip,
	Typography,
} from "@mui/material";
import {MdMenu} from "react-icons/all";
import {NavLink} from "react-router-dom";

const pages = {
	"Startpagina": "/",
	"Bestuur":     "/bestuur",
};

export default function Navbar() {
	const {
			  bestuurslid,
			  isAuthed,
		  }      = useSession();
	const logout = useLogout();


	const [anchorElNav, setAnchorElNav]                 = useState(null);
	const [anchorElBestuurslid, setAnchorElBestuurslid] = useState(null);

	const handleOpenNavMenu          = useCallback((event) => {
		setAnchorElNav(event.currentTarget);
	}, [setAnchorElNav]);
	const handleOpenBestuurslidMenu  = useCallback((event) => {
		setAnchorElBestuurslid(event.currentTarget);
	}, [setAnchorElBestuurslid]);
	const handleCloseNavMenu         = useCallback(() => {
		setAnchorElNav(null);
	}, [setAnchorElNav]);
	const handleCloseBestuurslidMenu = useCallback(() => {
		setAnchorElBestuurslid(null);
	}, [setAnchorElBestuurslid]);

	const handleLogout = useCallback(() => {
		logout();
	}, [logout]);

	const [openLoginSnackbar, setOpenLoginSnackbar] = useState(Boolean(isAuthed));
	const handleOpenLoginSnackbar                   = useCallback(() => {
		setOpenLoginSnackbar(true);
	}, [setOpenLoginSnackbar]);
	const handleCloseLoginSnackbar                  = useCallback(() => {
		setOpenLoginSnackbar(false);
	}, [setOpenLoginSnackbar]);
	useEffect(() => {
		if (isAuthed) {
			handleOpenLoginSnackbar();
		}
	}, [isAuthed, handleOpenLoginSnackbar]);

	const [openLogoutSnackbar, setOpenLogoutSnackbar] = useState(Boolean(!isAuthed));
	const handleOpenLogoutSnackbar                    = useCallback(() => {
		setOpenLogoutSnackbar(true);
	}, [setOpenLogoutSnackbar]);
	const handleCloseLogoutSnackbar                   = useCallback(() => {
		setOpenLogoutSnackbar(false);
	}, [setOpenLogoutSnackbar]);
	useEffect(() => {
		if (!isAuthed) {
			handleOpenLogoutSnackbar();
		}
	}, [isAuthed, handleOpenLogoutSnackbar]);

	return (<AppBar position="sticky">
			<Container>
				<Toolbar disableGutters>
					<Typography
						variant="h6"
						noWrap
						component="div"
						sx={{
							mr:      2,
							display: {
								xs: "none",
								md: "flex",
							},
						}}
					>
						KLJ Stekene
					</Typography>
					<Box
						sx={{
							flexGrow: 1,
							display:  {
								xs: "flex",
								md: "none",
							},
						}}
					>
						<IconButton
							size="large"
							aria-label="account of current user"
							aria-controls="menu-appbar-nav"
							aria-haspopup="true"
							onClick={handleOpenNavMenu}
							color="inherit"
						>
							<MdMenu />
						</IconButton>
						<Menu
							id="menu-appbar-nav"
							anchorEl={anchorElNav}
							anchorOrigin={{
								vertical:   "bottom",
								horizontal: "left",
							}}
							keepMounted
							transformOrigin={{
								vertical:   "top",
								horizontal: "left",
							}}
							open={Boolean(anchorElNav)}
							onClose={handleCloseNavMenu}
							sx={{
								display: {
									xs: "block",
									md: "none",
								},
							}}
						>
							{Object
								.entries(pages)
								.map(([pageText, pageLink]) => (<MenuItem key={pageText}>
									<NavLink to={pageLink}
											 style={{
												 textDecoration: "inherit",
												 color:          "inherit",
											 }}>
										{pageText}
									</NavLink>
								</MenuItem>))}
						</Menu>
					</Box>
					<Typography
						variant="H6"
						noWrap
						component="div"
						sx={{
							flexGrow: 1,
							display:  {
								xs: "flex",
								md: "none",
							},
						}}
					>
						KLJ Stekene
					</Typography>
					<Box sx={{
						flexGrow: 1,
						display:  {
							xs: "none",
							md: "flex",
						},
					}}>
						{Object
							.entries(pages)
							.map(([pageText, pageLink]) => (<Box key={pageText}
																 sx={{
																	 color: "white",
																 }}>
								<NavLink to={pageLink}
										 style={{
											 textDecoration: "inherit",
											 color:          "inherit",
										 }}>
									<Button sx={{color: "inherit"}}>{pageText}</Button>
								</NavLink>
							</Box>))}
					</Box>
					<Box sx={{flexGrow: 0}}>
						<Tooltip title={isAuthed ? `Welkom ${bestuurslid?.firstName}` : "Account"}>
							<IconButton onClick={handleOpenBestuurslidMenu}
										sx={{
											p:     0,
											color: "inherit",
										}}>
								{
									isAuthed ? (
										<Avatar alt={`${bestuurslid?.firstName} ${bestuurslid?.lastName}`}>{`${bestuurslid?.firstName[0]}${bestuurslid?.lastName[0]}`}</Avatar>) : (
										<Avatar alt="Guest" />)
								}
							</IconButton>
						</Tooltip>
						<Menu
							id="id-appbar-bestuurslid"
							anchorEl={anchorElBestuurslid}
							anchorOrigin={{
								vertical:   "bottom",
								horizontal: "right",
							}}
							keepMounted
							transformOrigin={{
								vertical:   "top",
								horizontal: "right",
							}}
							open={Boolean(anchorElBestuurslid)}
							onClose={handleCloseBestuurslidMenu}
						>
							{isAuthed ? (
								<div>
									<NavLink onClick={handleCloseBestuurslidMenu} to="/bestuurstaken" style={{
										textDecoration: "inherit",
										color:          "inherit",
									}}>
										<MenuItem>
											<Typography textAlign="center">Bewerk bestuurstaken</Typography>
										</MenuItem>
									</NavLink>
									<MenuItem onClick={handleLogout}>
										<Typography textAlign="center">Logout</Typography>
									</MenuItem>
								</div>
							) : (
								<NavLink onClick={handleCloseBestuurslidMenu} to="/login" style={{
									textDecoration: "inherit",
									color:          "inherit",
								}}>
									<MenuItem>
										<Typography textAlign="center">Login</Typography>
									</MenuItem>
								</NavLink>
							)}
						</Menu>
					</Box>
				</Toolbar>
			</Container>
			<Snackbar open={openLoginSnackbar} onClose={handleCloseLoginSnackbar} autoHideDuration={6000}>
				<Alert onClose={handleCloseLoginSnackbar} severity="success">
					{"Je ben ingelogd"}
				</Alert>
			</Snackbar>
			<Snackbar open={openLogoutSnackbar} onClose={handleCloseLogoutSnackbar} autoHideDuration={6000}>
				<Alert onClose={handleCloseLogoutSnackbar} severity="warning">
					{"Je ben uitgelogd"}
				</Alert>
			</Snackbar>
		</AppBar>
	);
}