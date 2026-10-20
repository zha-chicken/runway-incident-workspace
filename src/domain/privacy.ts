export class AppError extends Error {
  constructor(public code: string, public status = 400) {super(code);}
}
export function assertNoPersonalData(value: unknown): void {
  const text = typeof value === 'string' ? value : JSON.stringify(value);
  const sensitive = /(?:\+?86[-\s]?)?1[3-9]\d{9}\b|\b\d{17}[\dXx]\b|[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}|\b(?:passport|身份证|护照|旅客姓名|员工姓名|passenger name|employee name)\s*[:：]\s*\S+/i;
  if (sensitive.test(text)) throw new AppError('PERSONAL_DATA_REJECTED');
}
export function requireKnownAirport(id: string, ids: string[]) {
  if (!ids.includes(id)) throw new AppError('UNKNOWN_AIRPORT');
}
