import bcrypt from 'bcrypt'

const SALT_ROUNDS = 10;
export const hash = (plain: string) => {
    return bcrypt.hash(plain, SALT_ROUNDS);
}

export const compare = (plain: string, hashed: string) => {
    return bcrypt.compare(plain, hashed);
}