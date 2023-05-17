import httpMocks from 'node-mocks-http';
import { evaluateGeoJson } from './geoJson';
import { Response } from 'express';

const axios = require('axios');

jest.mock('axios');

describe('Validate all the use case of evaluation of OSM to GEO JSON.', () => {


    test('should return an error if bounding box parameter is missing', async () => {
        const mockRequest = httpMocks.createRequest({
            query: {},
        });

        const mockResponse: any = {
            send: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        await evaluateGeoJson(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(400);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Bounding box parameter (bbox) is required.' });
    });

    test('should return an error if no GeoJSON features found', async () => {
        const mockRequest = httpMocks.createRequest({
            query: {
                bbox: '-1,-1,-1,-1',
            },
        });

        const mockResponse: any = {
            send: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        axios.get.mockResolvedValue({ data: undefined });

        await evaluateGeoJson(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'No GeoJSON features found.' });
    });

    test('should return an error on failed retrieval of GeoJSON', async () => {
        const mockRequest = httpMocks.createRequest({
            query: {
                bbox: '-52.517446,52.517446,52.519400,52.519400',
            },
        });

        const mockResponse: any = {
            send: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const error = new Error('Failed to retrieve GeoJSON.');
        axios.get.mockRejectedValue(error);

        await evaluateGeoJson(mockRequest, mockResponse);

        expect(mockResponse.status).toHaveBeenCalledWith(500);
        expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Failed to retrieve GeoJSON.' });
    });

    test('should return GeoJSON on successful evaluation', async () => {
        const mockRequest = httpMocks.createRequest({
            query: {
                bbox: '13.3765,52.5165,13.3775,52.5175',
            },
        });

        const mockResponse: any = {
            send: jest.fn(),
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };

        const osmData = {
            osm: {
                way: [
                    {
                        '@_id': 'way1',
                        tag: [
                            {
                                '@_k': 'name',
                                '@_v': 'Street 1',
                            },
                        ],
                    },
                    {
                        '@_id': 'way2',
                        tag: [
                            {
                                '@_k': 'name',
                                '@_v': 'Street 2',
                            },
                        ],
                    },
                ],
            },
        };

        axios.get.mockResolvedValue({ data: osmData });

        await evaluateGeoJson(mockRequest, mockResponse);

        expect(axios.get).toHaveBeenCalledWith('https://www.openstreetmap.org/api/0.6/map', {
            params: {
                bbox: '13.3765,52.5165,13.3775,52.5175',
            },
        });
        expect(mockResponse.json).toBeTruthy()
    });
});
