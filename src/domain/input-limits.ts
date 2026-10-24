import type {IncidentInput} from './types';

// Shared by the input editor and API schemas. These are the existing limits.
export const INCIDENT_TEXT_LIMITS = {title:140,scenarioPeriod:200,knownInformation:6000,unknowns:6000,decisionRequest:2000} as const;
export const REPORT_TEXT_LIMITS = {text:6000,sourceLabel:200,applicablePeriod:200,reportedAt:100,originReportId:120,independenceGroup:120,verificationBasis:1000} as const;
export const MAX_REPORTS = 24;
export const MAX_REQUEST_BYTES = 200_000;
export const utf8Bytes = (text:string) => new TextEncoder().encode(text).byteLength;
export const jsonBytes = (body:unknown) => utf8Bytes(JSON.stringify(body));
export const incidentSaveBody = (input:IncidentInput,expectedVersion?:number) =>
  expectedVersion===undefined ? input : {expectedVersion,input};

export function incidentInputOverLimit(input:IncidentInput) {
  return input.reports.length>MAX_REPORTS ||
    Object.entries(INCIDENT_TEXT_LIMITS).some(([key,max])=>input[key as keyof typeof INCIDENT_TEXT_LIMITS].length>max) ||
    input.reports.some(report=>Object.entries(REPORT_TEXT_LIMITS).some(([key,max])=>(report[key as keyof typeof REPORT_TEXT_LIMITS]?.length??0)>max));
}
