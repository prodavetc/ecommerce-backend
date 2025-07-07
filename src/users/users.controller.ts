// ejemplo: src/users/users.controller.ts
import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  @Get()
  @Roles('admin') // solo admin
  findAll() {
    return 'Solo admins pueden ver esto';
  }
}
