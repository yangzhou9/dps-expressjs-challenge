import express from 'express';
import { authentification } from '../middleware/authentification';
import { ProjectService } from '../services/project.service';

const Router = express.Router();

Router.get('/projects', authentification, ProjectService.getAllProjects);
Router.post('/projects', authentification, ProjectService.addProject);

Router.get('/projects/:id', authentification, ProjectService.getProjectById);
Router.put('/projects/:id', authentification, ProjectService.updateProject);
Router.delete(
	'/projects/:id',
	authentification,
	ProjectService.deleteProjectById,
);

export { Router as projectRouter };
