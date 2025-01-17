import db from './db.service';
import { v4 as uuidv4 } from 'uuid';

interface Report {
	id: string;
	text: string;
	project_id: string;
}

function getAllReports() {
	return db.query('SELECT * FROM reports');
}

function getReportById(id: string) {
	const report = db.query(`SELECT * FROM reports WHERE id = '${id}'`);
	if (Object.keys(report).length === 0)
		throw new Error('The report with the given ID is not found.');
	return report;
}

function deleteReportById(id: string) {
	const report = getReportById(id);
	db.run(`DELETE FROM reports WHERE id = '${id}'`);
	return report;
}

function addReport(params: { [key: string]: string | number | undefined }) {
	const id = uuidv4();
	if (!existProjectById(String(params.projectid)))
		throw new Error('Invalid project ID.');
	db.run(
		'INSERT INTO reports (id, text, projectid) VALUES (:id, :text, :projectid)',
		{ id, ...params },
	);
	return { id, ...params };
}

function updateReport(params: { [key: string]: string | number | undefined }) {
	getReportById(String(params.id));
	if (!existProjectById(String(params.projectid)))
		throw new Error('Invalid project ID.');
	db.run(
		'UPDATE reports SET text = :text, projectid = :projectid WHERE id = :id',
		params,
	);
	return params;
}

function getReportWith3SameWords() {
	const reports = getAllReports() as Report[];
	return reports.filter((report) => {
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
}

function existProjectById(id: string) {
	const project = db.query(`SELECT * FROM projects WHERE id = '${id}'`);
	if (Object.keys(project).length === 0) {
		return false;
	} else {
		return true;
	}
}

export default {
	getAllReports,
	getReportById,
	deleteReportById,
	addReport,
	updateReport,
	getReportWith3SameWords,
};
