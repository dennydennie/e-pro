/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserDto } from './dto/user.dto';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @ApiOperation({
    summary: 'Create a new user',
    description: 'This endpoint allows you to create a new user in the system.',
  })
  @ApiResponse({ status: 201, description: 'The user has been created.' })
  @ApiResponse({ status: 400, description: 'Bad request. Check the input data.' })
  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const user = await this.userService.create(createUserDto);
    return UserDto.fromEntity(user);
  }

  @ApiOperation({
    summary: 'Get all users',
    description: 'This endpoint retrieves all the users in the system.',
  })
  @ApiResponse({ status: 200, description: 'The list of users.' })
  @Get()
  async findAll() {
    const users = await this.userService.findAll();
    return users.map((user) => UserDto.fromEntity(user));
  }

  @ApiOperation({
    summary: 'Get a user by ID',
    description: 'This endpoint retrieves a specific user by their ID.',
  })
  @ApiResponse({ status: 200, description: 'The user data.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user = await this.userService.findOne(id);
    return UserDto.fromEntity(user);
  }

  @ApiOperation({
    summary: 'Update a user',
    description: 'This endpoint allows you to update the details of an existing user.',
  })
  @ApiResponse({ status: 200, description: 'The updated user data.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    const user = await this.userService.update(id, updateUserDto);
    return UserDto.fromEntity(user);
  }

  @ApiOperation({
    summary: 'Delete a user',
    description: 'This endpoint allows you to delete a user from the system.',
  })
  @ApiResponse({ status: 200, description: 'The user has been deleted.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.userService.remove(id);
  }
}