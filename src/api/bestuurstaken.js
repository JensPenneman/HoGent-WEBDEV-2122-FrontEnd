import {axios} from ".";

export const getAllBestuurstaken = async () => {
	const {data} = await axios.get("bestuurstaken");
	return data;
};

export const saveBestuurstaak = async ({
										   id,
										   name,
										   description,
										   isSiteAdmin,
									   }) => {
	const {data} = await axios({
								   method: id ? "put" : "post",
								   url:    `bestuurstaken/${id ?? ""}`,
								   data:   {
									   name,
									   description,
									   isSiteAdmin,
								   },
							   });
	return data;
};

export const deleteBestuurstaak = async (id) => {
	await axios.delete(`bestuurstaken/${id}`);
};