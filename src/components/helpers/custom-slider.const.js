const until = [2021, 4];
const since = [2022, 9];


export const START_DATE = new Date(until);
export const FINISH_DATE = new Date(since);


const startDateForRangeMonth = new Date(until);
const finishDateForRangeMonth = new Date(since);

const startDateForRangeYear = new Date(until);
const finishDateForRangeYear = new Date(since);


export const MinDateMonth = new Date(startDateForRangeMonth.setMonth(startDateForRangeMonth.getMonth() - 2));
export const MaxDateMonth = new Date(finishDateForRangeMonth.setMonth(finishDateForRangeMonth.getMonth() + 3));

export const MinDateYear = new Date(startDateForRangeYear.setFullYear(startDateForRangeYear.getFullYear() - 2));
export const MaxDateYear = new Date(finishDateForRangeYear.setFullYear(finishDateForRangeYear.getFullYear() + 2));