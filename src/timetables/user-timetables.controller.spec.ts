import { Test, TestingModule } from '@nestjs/testing';
import { UserTimetablesController } from './user-timetables.controller';

describe('UserTimetablesController', () => {
  let controller: UserTimetablesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserTimetablesController],
    }).compile();

    controller = module.get<UserTimetablesController>(UserTimetablesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
