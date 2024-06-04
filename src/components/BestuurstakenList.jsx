import {Fragment, memo, useCallback, useEffect, useState} from "react";
import {useBestuurBestuurstaken} from "../contexts/BestuurslidBestuurtaakProvider";
import {Chip, Tooltip} from "@mui/material";
import {useSession} from "../contexts/AuthProvider";
import {useNavigate} from "react-router";

const BestuursChip = memo(({
							   id,
							   name,
							   description,
						   }) => {
	const {isSiteAdmin} = useSession();

	const {deleteBestuurslidBestuurstaak} = useBestuurBestuurstaken();

	const handleDeleteBestuurslidBestuurstaak = useCallback(() => {
		deleteBestuurslidBestuurstaak(id);
	}, [id, deleteBestuurslidBestuurstaak]);


	return (<Tooltip title={description} sx={{mx: 1}}>
		{isSiteAdmin ? (<Chip label={name} variant="outlined" onDelete={handleDeleteBestuurslidBestuurstaak} />) : (
			<Chip label={name} variant="outlined" />)}
	</Tooltip>);
});

const BestuurstakenList = memo(({bestuurslid_id}) => {
	const {
			  isAuthed,
			  isSiteAdmin,
		  }        = useSession();
	const navigate = useNavigate();

	const {bestuurBestuurstaken}                        = useBestuurBestuurstaken();
	const [bestuurstakenVanLid, setBestuurstakenVanLid] = useState([]);

	useEffect(() => {
		setBestuurstakenVanLid(bestuurBestuurstaken
								   .filter((bestuurslidBestuurstaak) => bestuurslidBestuurstaak.bestuurslid.id === bestuurslid_id));
	}, [bestuurBestuurstaken, setBestuurstakenVanLid, bestuurslid_id]);

	const handleVoegToe = useCallback(() => {
		if (isSiteAdmin) {
			navigate(`addTask/${bestuurslid_id}`);
		}
	}, [bestuurslid_id, navigate, isSiteAdmin]);

	return (<Fragment>
		{bestuurstakenVanLid.map((bestuurslidBestuurstaak) => {
			return <BestuursChip
				key={bestuurslidBestuurstaak.id}
				id={bestuurslidBestuurstaak.id}
				name={bestuurslidBestuurstaak.bestuurstaak.name}
				description={bestuurslidBestuurstaak.bestuurstaak.description}
			/>;
		})}
		{isAuthed && <Chip label="Voeg toe" clickable={Boolean(isSiteAdmin)} onClick={handleVoegToe} />}
	</Fragment>);
});

export default BestuurstakenList;