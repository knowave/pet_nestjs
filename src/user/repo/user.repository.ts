import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User) private readonly repository: Repository<User>,
  ) {}

  async save(user: User): Promise<User> {
    return await this.repository.save(user);
  }

  async bulkSave(users: User[]): Promise<User[]> {
    return await this.repository.save(users);
  }

  async softRemove(user: User): Promise<User> {
    return await this.repository.softRemove(user);
  }

  async bulkSoftRemove(users: User[]): Promise<User[]> {
    return await this.repository.softRemove(users);
  }

  async getUserByEmail(email: string): Promise<User> {
    return await this.repository
      .createQueryBuilder('user')
      .where('user.email = :email', { email })
      .getOne();
  }

  async getUserById(userId: string): Promise<User> {
    return await this.repository
      .createQueryBuilder('user')
      .where('user.id = :userId', { userId })
      .getOne();
  }

  async getUserByUsernameOrNickname(name: string): Promise<User> {
    return await this.repository
      .createQueryBuilder('user')
      .where('user.username = :name OR user.nickname = :name', { name })
      .getOne();
  }
}
