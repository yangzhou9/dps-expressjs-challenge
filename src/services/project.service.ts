import db from './db.service';
import { v4 as uuidv4 } from 'uuid';

function getAllProjects() {
	return db.query('SELECT * FROM projects');
}

function getProjectById(id: string) {
	const project = db.query(`SELECT * FROM projects WHERE id = '${id}'`);
	if (Object.keys(project).length === 0)
		throw new Error('The project with the given ID is not found.');
	return project;
}

function deleteProjectById(id: string) {
	const project = getProjectById(id);
	db.run(`DELETE FROM projects WHERE id = '${id}'`);
	return project;
}

function addProject(params: { [key: string]: string | number | undefined }) {
	const id = uuidv4();
	db.run(
		'INSERT INTO projects (id, name, description) VALUES (:id, :name, :description)',
		{ id, ...params },
	);
	return { id, ...params };
}

function updateProject(params: { [key: string]: string | number | undefined }) {
	getProjectById(String(params.id));
	db.run(
		'UPDATE projects SET name = :name, description = :description WHERE id = :id',
		params,
	);
	return params;
}

export default {
	getAllProjects,
	getProjectById,
	addProject,
	deleteProjectById,
	updateProject,
};
