import express from 'express';
import cors from 'cors'
import geoJsonRoute from './routes/geoJson';

const app = express();
const port = process.env.PORT || 3001;

app.use(cors())
app.use(express.json());
app.use('/api/geojson', geoJsonRoute);

app.get('/', (req, res) => {
	res.send(`
		<h1>Welcome</h1>
		<h2>The application is running successfully on localhost:3001</h2>
		<p>
			Please access the following URL as an example to see the output:
		</p>
		<a href="http://localhost:3001/api/geojson?bbox=13.3765,52.5165,13.3775,52.5175" />
	`)
})


app.listen(port, () => {
	console.log(`Server is running at http://localhost:${port}`);
});
