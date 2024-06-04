import {Fragment} from "react";
import {Button, Container, Typography} from "@mui/material";
import headerIMG from "../images/2019Sportfeest.jpg";
import {BsBoxArrowUpRight} from "react-icons/all";

export default function Startpagina() {
	return (<Fragment>
		<Container>
			<img src={headerIMG}
				 width="100%" alt="KLJ Stekene op een sportfeest" />
			<Typography variant="h1" component="h2">
				KLJ Stekene
			</Typography>
			<Typography component="p">
				We zijn een grote groep jongeren en volwassenen die heel het jaar door plezier maken.
				geloof je ons niet? Kom gerust eens langs!
				Naast heel veel plezier maken staat er vrijdag meestal een activiteit op het menu.
				Bovendien is er elk jaar een kamp, een weekend, en een KLJ-fuif.
				Ook hebben we heel wat andere evenementen! kijk even verder op onze site.
			</Typography>
			<a href="https://kljstekene.be" style={{
				textDecoration: "inherit",
				color:          "inherit",
			}}>
				<Button variant="contained" endIcon={<BsBoxArrowUpRight />}>
					Bezoek de echte KLJ Stekene pagina
				</Button>
			</a>
		</Container>
	</Fragment>);
}