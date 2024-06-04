import {Fragment, useCallback} from "react";
import {Card, CardContent, Container, Fab, Grid} from "@mui/material";
import {useBestuur} from "../../contexts/BestuurProvider";
import BestuurslidCard from "../../components/BestuurslidCard";
import {MdAdd} from "react-icons/all";
import {useSession} from "../../contexts/AuthProvider";
import {useNavigate} from "react-router";

export default function Bestuur() {
	const {bestuur} = useBestuur();
	const {
			  isAuthed,
			  isSiteAdmin,
		  }         = useSession();
	const navigate  = useNavigate();

	const handleAddBestuurslid = useCallback(() => {
		if (isSiteAdmin) {
			navigate("add");
		}
	}, [isSiteAdmin, navigate]);

	return (<Fragment>
		<Container>
			<Grid container
				  spacing={2}
				  columns={{
					  xs: 1,
					  sm: 2,
					  md: 3,
				  }}>
				{bestuur.map((bestuurslid) => {
					return (<Grid key={bestuurslid.id} item xs={1} sm={1} md={1}>
						<BestuurslidCard {...bestuurslid} />
					</Grid>);
				})}
				{isAuthed && <Grid item xs={1} sm={1} md={1}>
					<Card>
						<CardContent sx={{textAlign: "center"}}>
							<Fab color="primary"
								 aria-label="add"
								 disabled={!isSiteAdmin}
								 onClick={handleAddBestuurslid}>
								<MdAdd />
							</Fab>
						</CardContent>
					</Card>
				</Grid>}
			</Grid>
		</Container>
	</Fragment>);
}