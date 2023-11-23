export type userLastSeenReviewOnCourseDTO = {
  userId: number;
  courseId: number;
  lastSeenReviewId: number | null;
};

export function toUserLastSeenReviewOnCourseDTO(data: userLastSeenReviewOnCourseDTO): userLastSeenReviewOnCourseDTO {
  return {
    userId: data.userId,
    courseId: data.courseId,
    lastSeenReviewId: data.lastSeenReviewId,
  };
}
