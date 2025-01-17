import express, { Express } from 'express';
import dotenv from 'dotenv';
import { projectRouter } from './routes/project.routes';
import { reportRouter } from './routes/report.routes';

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

app.use('/api', projectRouter);
app.use('/api', reportRouter);

app.get('*', (req, res) => {
	res.status(505).json({ message: 'Bad Request' });
});
