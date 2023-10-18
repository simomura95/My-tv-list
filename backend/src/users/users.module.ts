import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from 'src/users/schemas/user.schema';
import { MoviesModule } from 'src/movies/movies.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MoviesModule
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService] // IMPORTANTE altrimenti ho errore quando lo uso nel modulo auth
})
export class UsersModule {}
