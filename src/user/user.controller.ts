import { Controller, Get, Post, Body, Param, HttpCode } from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterUserTokenDto } from './dto/RegisterUserTokenDto.dto';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('User')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post(':id/register-token')
  @ApiParam({ name: 'id', type: String })
  @ApiBody({ type: RegisterUserTokenDto })
  registerToken(@Param('id') id: string, @Body() data: RegisterUserTokenDto) {
    console.log('register user token', id, data);
    return this.userService.registerToken(+id, data);
  }

  @Get(':id/token')
  @ApiParam({ name: 'id', type: String })
  async getUserToken(@Param('id') id: string) {
    return (await this.userService.findOne(+id))?.fcm;
  }

  @Get(':id')
  @ApiParam({ name: 'id', type: String })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @HttpCode(200)
  @Get(':id/send-notification')
  sendNotification(@Param('id') id: string) {
    console.log(`test send-notification to user ${id}`);
    this.userService.sendNotification(+id).catch((err: Error) => {
      console.error(`test send-notification error`, err.message);
      throw new Error(err.message);
    });
  }
}
