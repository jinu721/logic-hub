import bcrypt from "bcryptjs";
import { IHashProvider } from "../interfaces/crypto.interface";

export class HashProvider implements IHashProvider {
  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async comparePasswords(raw: string, hashed: string): Promise<boolean> {
    return bcrypt.compare(raw, hashed);
  }
}

