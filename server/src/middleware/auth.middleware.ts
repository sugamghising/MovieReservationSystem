import { Request, Response, NextFunction } from 'express';
import { verify } from '../utils/jwt';

export const requireAuth = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
        return res.status(401).json({ error: "Missing Token" });
    }
    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: "Token required." })
    }

    try {
        const payload = verify(token);
        req.user = {
            userId: payload.userId as string,
            role: payload.role as string
        };
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
}