export class AppError extends Error {
  constructor(public code: string, public status = 400) {super(code);}
}
export function requireKnownAirport(id: string, ids: string[]) {
  if (!ids.includes(id)) throw new AppError('UNKNOWN_AIRPORT');
}
