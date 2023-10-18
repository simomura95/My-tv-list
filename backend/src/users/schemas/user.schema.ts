import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { MovieDocument } from 'src/movies/schemas/movie.schema';

export type UserDocument = HydratedDocument<User>;

export interface UserMovie {
    movie: MovieDocument,
    rating: number,
    addDate: Date
  }

@Schema()
export class User { 
  @Prop({ required: true, unique: true })
  username: string;

  @Prop({ required: true })
  password: string;

  @Prop({ default: [] })
  watchlist: UserMovie[]
}

export const UserSchema = SchemaFactory.createForClass(User);