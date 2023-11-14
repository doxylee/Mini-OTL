import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CoursesModule } from './courses/courses.module';
import { ReviewsModule } from './reviews/reviews.module';
import { LecturesModule } from './lectures/lectures.module';
import { SemestersModule } from './semesters/semesters.module';
import { TimetablesModule } from './timetables/timetables.module';

@Module({
  imports: [
    // TODO: Study configmodule
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `./env/.env.${process.env.NODE_ENV}`,
    }),
    UsersModule,
    AuthModule,
    CoursesModule,
    ReviewsModule,
    LecturesModule,
    SemestersModule,
    TimetablesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
