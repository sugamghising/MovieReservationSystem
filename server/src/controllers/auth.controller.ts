import { Request, Response } from 'express'
import { loginUser, registerUser } from '../services/auth.service';
import { loginSchema, registerSchema } from '../schemas/auth.schema';

export const login = async (req: Request, res: Response) => {
    // Validate request body
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ errors: parsed.error.format() });
    }

    const { email, password } = parsed.data;
    try {
        const result = await loginUser(email, password);
        res.status(200).json({ message: "Login successful", ...result });
    } catch (error) {
        res.status(401).json({
            message: "Could not login",
            error: error instanceof Error ? error.message : "Internal server error"
        })
    }
}

export const register = async (req: Request, res: Response) => {
    // Validate request body
    const parsed = registerSchema.safeParse(req.body);
    if (!parsed.success) {
        return res.status(400).json({ errors: parsed.error.format() });
    }

    const { name, email, password } = parsed.data;
    try {
        const user = await registerUser(name, password, email);
        res.status(201).json({
            message: "Registration successful",
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(400).json({
            message: "Could not register",
            error: error instanceof Error ? error.message : "Internal server error"
        })
    }
}
