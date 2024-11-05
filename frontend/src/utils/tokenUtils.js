import { jwtDecode } from "jwt-decode";

export const isTokenExpired = (token) => {
	if (!token) {
		return true;
	}

	const decoded = jwtDecode(token);
	const currentTime = Date.now() / 1000;
	return decoded.exp < currentTime;
};

export const getPayload = (token) => {
	const arrayToken = token.split(".");
	const tokenPayload = JSON.parse(atob(arrayToken[1]));
	return tokenPayload;
};
