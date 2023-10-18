import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { Movie, MovieSchema} from './schemas/movie.schema'

@Module({
  imports: [MongooseModule.forFeature([{ name: Movie.name, schema: MovieSchema }])], // name non è proprietà del modello, si riferisce proprio al nome dello schema/classe
  controllers: [MoviesController],
  providers: [MoviesService],
  exports: [MoviesService]
})
export class MoviesModule {}
