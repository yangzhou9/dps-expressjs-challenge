import express, { Express } from 'express';
import dotenv from 'dotenv';
import projectService from './services/project.service';
import reportService from './services/report.service';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.listen(port, () => {
	console.log(`[server]: Server is running at http://localhost:${port}`);
});

app.get('/', (req, res) => {
	res.send('Hello!');
});

app.get('/api/projects', (req, res) => {
	res.json(projectService.getAllProjects());
});

app.get('/api/projects/:id', (req, res) => {
	const project = projectService.getProjectById(req.params.id);
	if (Object.keys(project).length === 0) {
		res.status(404).send('The project with the given ID is not found.');
	}
	res.json(project);
});

app.get('/api/reports/', (req, res) => {
	res.json(reportService.getAllReports());
});

app.get('/api/reports/:id', (req, res) => {
	const report = reportService.getReportById(req.params.id);
	if (Object.keys(report).length === 0) {
		res.status(404).send('The report with the given ID is not found.');
	}
	res.json(report);
});
