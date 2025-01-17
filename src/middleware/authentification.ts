import { NextFunction, Request, Response } from 'express';
import dotenv from 'dotenv';

dotenv.config();

const AUTH_TOKEN = 'Password123';

export const authentification = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const token = req.headers.authorization;

	if (token === `Bearer ${AUTH_TOKEN}`) {
		return next();
	} else {
		return res.status(401).json({
			message: 'Unauthorized: Invalid or missing token',
		});
	}
};
