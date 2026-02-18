import { useMutation, useQuery } from "@tanstack/react-query"
import { createJob, createJobReferral, getJobReferralByEmployee, getJobReferralByJob, getJobs, getOpenJobs, manageJobStatus, updateJob } from "../api/JobApiCall"
import { use } from "react"

export const useGetJobs = () => {
    return useQuery({
        queryKey: ['Jobs'],
        queryFn: getJobs
    })
}

export const useGetOpenJobs = () => {
    return useQuery({
        queryKey: ['OpenJobs'],
        queryFn: getOpenJobs
    })
}

export const useGetJobReferralByJob = (jobId:number) => {
    return useQuery({
        queryKey: ['JobReferralJ',jobId],
        queryFn: () => getJobReferralByJob(jobId)
    })
}

export const useGetJobReferralByEmployee = (employeeId:number) => {
    return useQuery({
        queryKey: ['JobReferralE', employeeId],
        queryFn: () => getJobReferralByEmployee(employeeId)
    })
}

export const useCreateJobReferral = () => {
    return useMutation({
        mutationFn: createJobReferral
    })
}

export const useCreateJob = () => {
    return useMutation({
        mutationFn: createJob
    })
}

export const useUpdateJob = () => {
    return useMutation({
        mutationFn: updateJob
    })
}

export const useManageJobStatus = () =>{
    return useMutation({
        mutationFn: manageJobStatus
    })
}