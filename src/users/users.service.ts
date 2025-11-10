import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcryptjs from 'bcryptjs';

@Injectable()
export class UsersService {

  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    // buscar el usuario existente
    const existingUser = await this.findOneByEmail(createUserDto.email);
    if (existingUser) {
      throw new Error('User already exists');
    }
    // Hash para la contraseña
    if (createUserDto.password){
      createUserDto.password = await bcryptjs.hash(createUserDto.password, 10);
    }

    return this.userRepository.save(createUserDto);
  }

  findOneByEmail(email: string) {
    return this.userRepository.findOneBy({ email });
  }

  findByEmailWithPassword(email: string) {
    return this.userRepository.findOne({ 
      where:{ email },
      select: ['id', 'name', 'email', 'password', 'role']
    });
  }

  findAll() {
    return this.userRepository.find();
  }

  findOne(id: number) {
    return this.userRepository.findOneBy({ id });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {

    // buscar el usuario existente
    const existingUser = await this.userRepository.findOneBy({ id });
    if (!existingUser) {
      throw new Error('User not found');
    }
    // Hash para la contraseña
    if (updateUserDto.password){
      updateUserDto.password = await bcryptjs.hash(updateUserDto.password, 10);
    }
    return this.userRepository.update(id, updateUserDto);
  }

  remove(id: number) {
    return this.userRepository.delete(id);
  }
}
