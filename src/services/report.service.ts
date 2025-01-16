import db from './db.service';

function getAllReports() {
	return db.query('SELECT * FROM reports');
}

function getReportById(id: string) {
	return db.query(`SELECT * FROM reports WHERE id = ${id}`);
}

export default { getAllReports, getReportById };
