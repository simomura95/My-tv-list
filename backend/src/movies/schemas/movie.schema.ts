import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MovieDocument = HydratedDocument<Movie>;

@Schema()
export class Movie {
  @Prop({ required: true })
  title: string;

  @Prop({ })
  overview: string;

  @Prop({ required: true })
  release_date: string;

  @Prop({ })
  image_url: string;

  @Prop({ required: true })
  moviedb_id: number;

  @Prop({default: []})
  ratings: number[];
}

export const MovieSchema = SchemaFactory.createForClass(Movie);