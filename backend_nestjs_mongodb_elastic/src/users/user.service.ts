import { Auth } from '../shared/auth/auth.model';
import { DeleteUserInput } from './inputs/deleteUser.input';
import { UpdateUserInput } from './inputs/updateUser.input';
import { Jwt } from './model/jwt.model';
import { AuthPayloadDTO } from './interfaces/authPayload.interface';
import { LoginInput } from './inputs/login.input';
import { CreateUserInput } from './inputs/createUser.input';
import { Model } from 'mongoose';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { UserDTO } from './interfaces/user.interface';
import { compare, hash } from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';
import { RoleEnum } from './enum/role.enum';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('User') private userModel: Model<UserDTO>,
    private readonly jwtService: JwtService,
  ) {}

  public async findAll(): Promise<UserDTO[]> {
    return await this.userModel.find().exec();
  }

  public async findById(userId: string): Promise<UserDTO> {
    const found = await this.userModel
      .findOne({
        _id: userId,
      })
      .exec();
    if (!found) {
      return null;
    }
    return found;
  }

  public async findByEmail(email: string): Promise<UserDTO> {
    let found = await this.userModel.findOne({ email: email });
    if (!found) {
      return null;
    }
    return found;
  }
  public async findManyById(ids: [string]): Promise<UserDTO[]> {
    let found = await this.userModel.find({
      _id: { $in: ids },
    });
    if (!found) {
      return null;
    }
    return found;
  }

  public async findManyByShopId(shopId: string): Promise<UserDTO[]> {
    let found = await this.userModel.find({
      shopId: shopId,
    });
    if (!found) {
      return null;
    }
    return found;
  }

  public async login(input: LoginInput): Promise<AuthPayloadDTO> {
    let found = await this.findByEmail(input.email);
    if (!found) {
      throw new UnauthorizedException(`Email not found`);
    }
    const validated = await this.validatePassword(
      input.password,
      found.password,
    );
    if (!validated) {
      throw new UnauthorizedException('Wrong password');
    }

    return { user: found, token: this.signToken(found.id) };
  }

  private signToken(id: string) {
    const payload: Jwt = { userId: id };
    return this.jwtService.sign(payload, {
      expiresIn: '7d',
    });
  }

  public async checkFound(userId: string) {
    const found = await this.findById(userId);
    if (!found) {
      throw new NotFoundException(`Email not found`);
    }
    return found;
  }

  public async validatePassword(
    password: string,
    hashPassword: string,
  ): Promise<Boolean> {
    const result = await compare(password, hashPassword);
    return result;
  }

  private async hash(password: string) {
    return await hash(password, 10);
  }

  public async createUser(input: CreateUserInput): Promise<AuthPayloadDTO> {
    const found = await this.findByEmail(input.email);
    if (found) {
      throw new BadRequestException(`Email already existed`);
    }
    const password = await this.hash(input.password);
    const createdUser = await this.userModel.create({
      ...input,
      password,
    });
    createdUser.save();
    return {
      token: this.signToken(createdUser.id),
      user: createdUser,
    };
  }

  public async updateUser(input: UpdateUserInput): Promise<UserDTO> {
    this.checkFound(input.userId);
    let userId = input.userId;
    delete input.userId;
    let args = { ...input };

    if (input.password) {
      let password = input.password;
      const newPasswordhash = await this.hash(password);
      args.password = newPasswordhash;
    }

    const updated = await this.userModel
      .findOneAndUpdate(
        { _id: userId },
        {
          $set: args,
        },
        { new: true },
      )
      .exec();
    return updated;
  }

  public async deleteUser(
    input: DeleteUserInput,
    user: Auth,
  ): Promise<UserDTO> {
    this.checkFound(input.userId);
    const deleted = await this.userModel.findOneAndRemove({
      _id: input.userId,
    });
    return deleted;
  }

  public async deleteAllUsers() {
    const deleted = await this.userModel.deleteMany();
    return deleted;
  }
}
