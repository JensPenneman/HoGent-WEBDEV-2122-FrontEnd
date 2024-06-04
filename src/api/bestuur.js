import {axios} from ".";

export const login = async (mail, password) => {
	const {data} = await axios.post("bestuur/login", {
		mail,
		password,
	});
	return data;
};

export const register = async ({
								   firstName,
								   lastName,
								   password,
							   }) => {
	const {data} = await axios.post("bestuur/register", {
		firstName,
		lastName,
		password,
	});
	return data;
};

export const getBestuurslidById = async (id) => {
	const {data} = await axios.get(`bestuur/${id}`);
	return data;
};