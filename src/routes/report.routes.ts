import express from 'express';
import { authentification } from '../middleware/authentification';
import { ReportController } from '../controller/report.controller';

const Router = express.Router();

Router.get('/reports', authentification, ReportController.getAllReports);
Router.post('/reports', authentification, ReportController.addReport);

Router.get('/reports/:id', authentification, ReportController.getReportById);
Router.put('/reports/:id', authentification, ReportController.updateReport);
Router.delete(
	'/reports/:id',
	authentification,
	ReportController.deleteReportById,
);

Router.get(
	'/reportswith3samewords',
	authentification,
	ReportController.getReportWith3SameWords,
);
export { Router as reportRouter };
