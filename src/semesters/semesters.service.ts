import { Injectable } from '@nestjs/common';

@Injectable()
export class SemestersService {
  constructor() {}

  getCurrentSemester() {
    const today = new Date();
    let currentYear = today.getFullYear();
    const currentMonth = today.getMonth() + 1;
    let currentSeason;
    // TODO: This is placeholder logic
    if (currentMonth >= 3 && currentMonth <= 6) currentSeason = 1;
    else if (currentMonth >= 7 && currentMonth <= 8) currentSeason = 2;
    else if (currentMonth >= 9 && currentMonth <= 12) currentSeason = 3;
    else if (currentMonth >= 1 && currentMonth <= 2) {
      currentSeason = 4;
      currentYear -= 1;
    }

    return { year: currentYear, season: currentSeason };
  }
}
