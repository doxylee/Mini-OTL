import { Controller, Get, UseGuards, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { UserProfileDTO, toUserProfileDTO } from 'src/common/dto/users/users.dto';
import { JWTPayload } from 'src/common/dto/auth/auth.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guard';
import { JWTUser } from 'src/common/decorators/jwtuser.decorator';
import { ReviewsService } from 'src/reviews/reviews.service';
import { toReviewWithLikesDTO } from 'src/common/dto/reviews/reviews.dto';

@Controller('api/users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly reviewsService: ReviewsService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async getProfile(@JWTUser() jwt: JWTPayload): Promise<UserProfileDTO> {
    const user = await this.usersService.getUserWithDeptById(jwt.id);
    if (!user) throw new NotFoundException('User not found');
    // TODO: Add more data to response
    return toUserProfileDTO(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get('reviews')
  async getMyReviews(@JWTUser() jwt: JWTPayload) {
    const result = await this.reviewsService.getReviewsOfUser(jwt.id);
    return result.map(toReviewWithLikesDTO);
  }
}
