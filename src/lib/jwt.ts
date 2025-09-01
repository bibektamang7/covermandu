import jwt from "jsonwebtoken";

interface SignProps {
	id: string;
	email: string;
}

const token_secret = process.env.TOKEN_SECERT;

export const generateToken = (data: SignProps) => {
	const token = jwt.sign(data, token_secret!, { expiresIn: "1h" });
	return token;
};

export const decodeToken = (token: string): SignProps => {
	const decodedToken = jwt.verify(token, token_secret!) as SignProps;
	return decodedToken;
};
