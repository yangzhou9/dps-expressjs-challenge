import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Joi from 'joi';
import db from '../services/db.service';

interface Report {
	id: string;
	text: string;
	projectid: string;
}

export class ReportController {
	static async getAllReports(req: Request, res: Response) {
		const projects = db.query('SELECT * FROM reports');
		return res.status(200).json(projects);
	}

	static async getReportById(req: Request, res: Response) {
		const report = db.query(
			`SELECT * FROM reports WHERE id = '${req.params.id}'`,
		);
		if (Object.keys(report).length === 0)
			return res
				.status(404)
				.send('The report with the given ID is not found.');
		return res.status(200).json(report);
	}

	static async deleteReportById(req: Request, res: Response) {
		const report = db.query(
			`SELECT * FROM reports WHERE id = '${req.params.id}'`,
		);
		if (Object.keys(report).length === 0)
			return res
				.status(404)
				.send('The report with the given ID is not found.');
		db.run(`DELETE FROM reports WHERE id = '${req.params.id}'`);
		return res.status(200).json({
			message: 'Report deleted successfully',
			report,
		});
	}

	static async addReport(req: Request, res: Response) {
		const error = validateSchema(req);
		if (error) return res.status(400).send(error.details[0].message);

		if (!existProjectById(String(req.body.projectid)))
			return res.status(404).send('Invalid project ID.');

		const id = uuidv4();
		const text = req.body.text;
		const projectid = req.body.projectid;

		db.run(
			'INSERT INTO reports (id, text, projectid) VALUES (:id, :text, :projectid)',
			{ id, text, projectid },
		);
		return res.status(200).json({
			message: 'Report added successfully',
			report: [{ id, text, projectid }],
		});
	}

	static async updateReport(req: Request, res: Response) {
		const error = validateSchema(req);
		if (error) return res.status(400).send(error.details[0].message);

		const report = db.query(
			`SELECT * FROM reports WHERE id = '${req.params.id}'`,
		);
		if (Object.keys(report).length === 0)
			return res
				.status(404)
				.send('The report with the given ID is not found.');
		if (!existProjectById(String(req.body.projectid)))
			return res.status(404).send('Invalid project ID.');

		const id = req.params.id;
		const text = req.body.text;
		const projectid = req.body.projectid;
		db.run(
			'UPDATE reports SET text = :text, projectid = :projectid WHERE id = :id',
			{ id, text, projectid },
		);
		return res.status(200).json({
			message: 'Report updated successfully',
			report: [{ id, text, projectid }],
		});
	}

	static async getReportWith3SameWords(req: Request, res: Response) {
		let reports = db.query('SELECT * FROM reports') as Report[];
		reports = reports.filter((report) => {
			const wordCounts: Record<string, number> = {};

			// Split the text into words (case-insensitive and removing punctuation)
			const words = report.text
				.toLowerCase()
				.replace(/[^\w\s]/g, '') // Remove punctuation
				.split(/\s+/); // Split by whitespace

			// Count occurrences of each word
			for (const word of words) {
				if (word) {
					wordCounts[word] = (wordCounts[word] || 0) + 1;
				}
			}

			// Check if any word occurs at least 3 times
			return Object.values(wordCounts).some((count) => count >= 3);
		});
		return res.status(200).json(reports);
	}
}

function existProjectById(id: string) {
	const project = db.query(`SELECT * FROM projects WHERE id = '${id}'`);
	if (Object.keys(project).length === 0) {
		return false;
	} else {
		return true;
	}
}

function validateSchema(req: Request) {
	const schema = Joi.object({
		text: Joi.string().required(),
		projectid: Joi.string().required(),
	});
	const { error } = schema.validate(req.body);
	return error;
}
