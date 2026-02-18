import type { TravelEmployeeType } from "./TravelPlan"

export interface JobType{
    jobId:number
    title:string
    isOpen:boolean
    openedAt:Date
    salary:number
    requirement:number
    location:string
    jobDescriptionUrl:string
    createdBy: TravelEmployeeType
    referralCount?: number
}

export interface JobCreateType{
    jobId?:number
    title:string
    salary:number
    requirement:number
    location:string
    file:FileList
}

export interface JobReferralType{
    jobReferralId:string
    referee:string
    refereeEmail:string
    resumeUrl:string
    referralStatus:string
    jobJobId:number
    jobTitle:string
    referrer:TravelEmployeeType
}

export interface JobReferralCreateType{
    referee:string
    refereeEmail:string
    jobId:number
    file:FileList
}