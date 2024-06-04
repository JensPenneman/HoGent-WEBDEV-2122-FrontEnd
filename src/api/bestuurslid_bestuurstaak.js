import {axios} from ".";

export const getAllBestuurslid_Bestuurstaak = async () => {
	const {data} = await axios.get("bestuurslid_bestuurstaak", {
		params: {
			limit:  300,
			offset: 0,
		},
	});
	return data;
};

export const saveBestuurslid_Bestuurstaak = async ({
													   id,
													   bestuurslid_id,
													   bestuurstaak_id,
												   }) => {
	const {data} = await axios({
								   method: id ? "put" : "post",
								   url:    `bestuurslid_bestuurstaak/${id ?? ""}`,
								   data:   {
									   bestuurslid_id,
									   bestuurstaak_id,
								   },
							   });
	return data;
};

export const deleteBestuurslid_Bestuurstaak = async (id) => {
	await axios.delete(`bestuurslid_bestuurstaak/${id}`);
};