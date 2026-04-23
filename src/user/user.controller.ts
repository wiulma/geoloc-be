import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post(':id/register-token')
  registerToken(@Param('id') id: string, @Body() data: RegisterUserTokenDto) {
    return this.userService.registerToken(+id, data);
  }

  @Get(':id/token')
  async getUserToken(@Param('id') id: string) {
    return (await this.userService.findOne(+id))?.fcm;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }
}
