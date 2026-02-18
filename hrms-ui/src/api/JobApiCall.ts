import type { ApiResponseType } from "../types/ApiResponse";
import type { JobReferralCreateType, JobType } from "../types/Job";
import { Api } from "./AxiosBase";

export const getJobs = async(): Promise<JobType[]> =>{
    const response = await Api.get(`/job`);
    return response.data.data;
}

export const getOpenJobs = async(): Promise<JobType[]> => {
    const response = await Api.get('/job/open');
    return response.data.data;
}

export const getJobReferralByJob = async(jobId:number) : Promise<JobType[]> => {
    const response = await Api.get(`/job/referral/${jobId}`);
    return response.data.data;
}

export const getJobReferralByEmployee = async(employeeId:number) : Promise<JobType[]> => {
    const response = await Api.get(`/employee/referral/${employeeId}`);
    return response.data.data;
}

export const createJobReferral = async(referral:JobReferralCreateType) : Promise<ApiResponseType<Object>> => {
    const response = await Api.post('/job/referral', referral);
    return response.data;
} 

export const createJob = async(job:FormData): Promise<ApiResponseType<Object>> => {
    const response = await Api.post('/job', job, {headers: {'Content-Type': 'multipart/form-data'}});
    return response.data;
}

export const updateJob = async(job:FormData): Promise<ApiResponseType<Object>> => {
    const response = await Api.patch('/job', job, {headers: {'Content-Type': 'multipart/form-data'}});
    return response.data;
}

export const manageJobStatus = async({jobId, isOpen}:{jobId:number, isOpen:boolean}): Promise<ApiResponseType<Object>> =>{
    const response = await Api.patch(`/job/${jobId}/${isOpen}`);
    return response.data;
}
