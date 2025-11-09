import prisma from '../config/db'
import { compare, hash } from '../utils/hash';
import { sign } from '../utils/jwt';

export const registerUser = async (name: string, password: string, email: string) => {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new Error('Email already registered');
    }

    const passwordHash = await hash(password);

    const user = await prisma.user.create({
        data: { name, email, passwordHash }
    });
    return user;
}

export const loginUser = async (email: string, password: string) => {
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
        throw new Error('Invalid credentials');
    }
    const ok = await compare(password, user.passwordHash);
    if (!ok) {
        throw new Error('Invalid credentials');
    }
    const token = sign({ userId: user.id, role: user.role });
    return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
}

