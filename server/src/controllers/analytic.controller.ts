import { Request, Response } from "express";
import * as analyticsService from '../services/analytic.service'

export const getRevenueReport = async (req: Request, res: Response) => {
    try {
        const { startDate, endDate } = req.query;

        const start = startDate ? new Date(startDate as string) : undefined;
        const end = endDate ? new Date(endDate as string) : undefined;

        const report = await analyticsService.getRevenueReport(start, end);
        return res.json(report);

    } catch (error) {
        console.error('Error generating revenue report:', error);
        return res.status(500).json({
            message: 'Failed to generate revenue report',
            error: error instanceof Error ? error.message : 'Unknown error'
        })
    }
}

export const getOccupancyReport = async (req: Request, res: Response) => {
    try {
        const { startDate, endDate } = req.query;

        const start = startDate ? new Date(startDate as string) : undefined;
        const end = endDate ? new Date(endDate as string) : undefined;

        const report = await analyticsService.getOccupancyReport(start, end);
        return res.json(report);

    } catch (error) {
        console.error('Error generating occupancy report:', error);
        return res.status(500).json({
            message: 'Failed to generate occupancy report',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}


export const getPopularMoviesReport = async (req: Request, res: Response) => {
    try {
        const { limit, startDate, endDate } = req.query;

        const movieLimit = limit ? parseInt(limit as string, 10) : 10
        const start = startDate ? new Date(startDate as string) : undefined;
        const end = endDate ? new Date(endDate as string) : undefined;

        const report = await analyticsService.getPopularMoviesReport(movieLimit, start, end);
        return res.json(report);
    } catch (error) {
        console.error('Error generating popular movies report:', error);
        return res.status(500).json({
            message: 'Failed to generate popular movies report',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}

export const getCancellationReport = async (req: Request, res: Response) => {
    try {
        const { startDate, endDate } = req.query;

        const start = startDate ? new Date(startDate as string) : undefined;
        const end = endDate ? new Date(endDate as string) : undefined;

        const report = await analyticsService.getCancellationReport(start, end);
        return res.json(report);
    } catch (error) {
        console.error('Error generating cancellation report:', error);
        return res.status(500).json({
            message: 'Failed to generate cancellation report',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
}

export const getDashboardOverview = async (_req: Request, res: Response) => {
    try {
        const overview = await analyticsService.getDashboardOverview();
        return res.json(overview);
    } catch (error) {
        console.error('Error generating dashboard overview:', error);
        return res.status(500).json({
            message: 'Failed to generate dashboard overview',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};