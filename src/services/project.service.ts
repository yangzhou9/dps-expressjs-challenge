import db from './db.service';

function getAllProjects() {
	return db.query('SELECT * FROM projects');
}

function getProjectById(id: string) {
	return db.query(`SELECT * FROM projects WHERE id = ${id}`);
}

export default { getAllProjects, getProjectById };
