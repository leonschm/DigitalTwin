import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserProvider } from './user.provider';
import { DbModule } from 'src/db/db.module';
import { Prisma } from '@prisma/client';
import { PrismaProvider } from 'src/db/prisma.provider';

@Module({
  controllers: [UserController],
  providers: [UserProvider, PrismaProvider],
  imports: [DbModule],
})
export class UserModule {}
