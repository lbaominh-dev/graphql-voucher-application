import { Repository } from "typeorm";
import appDataSource from "../../libs/database";
import { User } from "../user/user.entity";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET, REFRESH_SECRET } from "../../config";
import { RegisterInput } from "./auth.input";
import { TokenResponse } from "./auth.type";

export class AuthService {
  private readonly userRepository: Repository<User>;

  constructor() {
    this.userRepository = appDataSource.getRepository(User);
  }

  async login(email: string, password: string): Promise<TokenResponse | null> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      return null;
    }

    const isPasswordValid = await this.isPasswordValid(password, user.password);

    if (!isPasswordValid) {
      return null;
    }

    return {
      accessToken: this.generateAccessToken(user),
      refreshToken: this.generateRefreshToken(user),
    };
  }

  async register(data: RegisterInput): Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = this.userRepository.create({
      email: data.email,
      password: hashedPassword,
    });

    return await this.userRepository.save(user);
  }

  async refreshToken(refreshToken: string): Promise<TokenResponse | null> {
    try {
      const decoded = jwt.verify(refreshToken, REFRESH_SECRET) as {
        id: number;
        email: string;
        name: string;
      };

      const user = await this.userRepository.findOne({
        where: { id: decoded.id },
      });

      if (!user) {
        return null;
      }

      return {
        accessToken: this.generateAccessToken(user),
        refreshToken: this.generateRefreshToken(user),
      };
    } catch (e) {
      return null;
    }
  }

  async validateToken(accessToken: string): Promise<User | null> {
    try {
      const decoded = jwt.verify(accessToken, JWT_SECRET) as {
        id: number;
        email: string;
        name: string;
      };

      return await this.userRepository.findOne({
        where: { id: decoded.id },
      });
    } catch (e) {
      return null;
    }
  }

  private generateAccessToken(user: User): string {
    return jwt.sign(
      { id: user.id, email: user.email, name: user.userName },
      JWT_SECRET,
      {
        expiresIn: "15m",
      }
    );
  }

  private generateRefreshToken(user: User): string {
    return jwt.sign(
      { id: user.id, email: user.email, name: user.userName },
      REFRESH_SECRET,
      {
        expiresIn: "7d",
      }
    );
  }

  private isPasswordValid(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }
}
