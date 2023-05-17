import axios from 'axios';
import { Request, Response } from 'express';
import osmtogeojson from 'osmtogeojson';
import { FeatureCollection } from 'geojson'

const OSM_API_URL = 'https://www.openstreetmap.org/api/0.6/map';

async function evaluateGeoJson(req: Request, res: Response) {
    const { bbox } = req.query

    // Check if the bbox query parameter is present
    if (!bbox) {
        return res.status(400).json({ error: 'Bounding box parameter (bbox) is required.' });
    }

    try {
        const osmResponse = await axios.get(OSM_API_URL, {
            params: { bbox },
        });

        if (!osmResponse.data) {
            return res.status(500).json({ error: 'No GeoJSON features found.' });
        }

        const geojson: FeatureCollection = osmtogeojson(osmResponse.data);

        // If the geo json is empty
        if (!geojson || !geojson.features || geojson.features.length === 0) {
            return res.status(500).json({ error: 'No GeoJSON features found.' });
        }

        // In case of succcess, return the GeoJSON
        return res.status(200).json(geojson);
    } catch (error) {
        console.error('Error retrieving GeoJSON:', error);
        return res.status(500).json({ error: 'Failed to retrieve GeoJSON.' });
    }
}

export { evaluateGeoJson };