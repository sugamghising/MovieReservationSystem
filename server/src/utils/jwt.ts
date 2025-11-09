import jwt, { JwtPayload, Secret } from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()
const SECRET = process.env.JWT_SECRET;
if (!SECRET) throw new Error("Missing JWT_SECRET");

export const sign = (payload: object, expiresIn = "1h"): string => {
    return jwt.sign(payload, SECRET, { expiresIn } as jwt.SignOptions)
}

export const verify = (token: string): JwtPayload => {
    return jwt.verify(token, SECRET) as JwtPayload;
}