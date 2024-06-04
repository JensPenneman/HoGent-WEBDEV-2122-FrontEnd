import {Fragment, useCallback} from "react";
import {useBestuurstaken} from "../../contexts/BestuurstaakProvider";
import {Button, Container, IconButton} from "@mui/material";
import {DataGrid} from "@mui/x-data-grid";
import {MdDelete, MdEdit} from "react-icons/all";
import {useNavigate} from "react-router";
import {useSession} from "../../contexts/AuthProvider";
import ErrorSnack from "../../components/ErrorSnack";

export default function Bestuurstaken() {
	const {
			  loading,
			  error,
			  bestuurstaken,
			  deleteBestuurstaak,
		  }             = useBestuurstaken();
	const navigate      = useNavigate();
	const {isSiteAdmin} = useSession();


	const handleAddBestuurstaak  = useCallback(() => {
		if (isSiteAdmin) {
			navigate("add");
		}
	}, [isSiteAdmin, navigate]);
	const handleEditBestuurstaak = useCallback((event, cellValues) => {
		if (isSiteAdmin) {
			navigate(`edit/${cellValues.row.id}`);
		}
	}, [isSiteAdmin, navigate]);
	const handleDelete           = useCallback((event, cellValues) => {
		deleteBestuurstaak(cellValues.row.id);
	}, [deleteBestuurstaak]);
	const handleCellClick        = useCallback((param, event) => {
		event.stopPropagation();
	}, []);
	const handleRowClick         = useCallback((param, event) => {
		event.stopPropagation();
	}, []);

	const cols = [{
		field:      "name",
		headerName: "Naam",
		minWidth:   200,
	}, {
		field:      "description",
		headerName: "Omschrijving",
		minWidth:   450,
	}, {
		field:      "isSiteAdmin",
		headerName: "Is site admin",
		type:       "boolean",
		minWidth:   110,
	}, {
		field:      "actions",
		headerName: "Opties",
		minWidth:   150,
		renderCell: (cellValues) => {
			return (<div>
				<IconButton
					disabled={!isSiteAdmin}
					color={isSiteAdmin ? "primary" : "inherit"}
					onClick={(event) => {handleEditBestuurstaak(event, cellValues);}}
				>
					<MdEdit />
				</IconButton>
				<IconButton
					disabled={!isSiteAdmin}
					color={isSiteAdmin ? "error" : "inherit"}
					onClick={(event) => {handleDelete(event, cellValues);}}
				>
					<MdDelete />
				</IconButton>
			</div>);
		},
	}];

	return (<Fragment>
		<Container>
			<DataGrid
				loading={loading}
				columns={cols}
				rows={bestuurstaken}
				density="compact"
				pageSize={50}
				rowsPerPageOptions={[50]}
				hideFooter
				autoHeight
				onCellClick={handleCellClick}
				onRowClick={handleRowClick}
			/>
			<Button onClick={handleAddBestuurstaak} disabled={!isSiteAdmin}>
				Bestuurstaak toevoegen
			</Button>
		</Container>
		<ErrorSnack error={error} />
	</Fragment>);
}