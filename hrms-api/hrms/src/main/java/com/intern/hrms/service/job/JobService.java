package com.intern.hrms.service.job;

import com.intern.hrms.dto.job.request.JobReferralRequestDTO;
import com.intern.hrms.dto.job.request.JobRequestDTO;
import com.intern.hrms.dto.job.response.JobReferralResponseDTO;
import com.intern.hrms.dto.job.response.JobResponseDTO;
import com.intern.hrms.entity.Employee;
import com.intern.hrms.entity.job.Job;
import com.intern.hrms.entity.job.JobReferral;
import com.intern.hrms.entity.job.JobSharing;
import com.intern.hrms.enums.ReferralStatusEnum;
import com.intern.hrms.repository.EmployeeRepository;
import com.intern.hrms.repository.job.JobReferralRepository;
import com.intern.hrms.repository.job.JobRepository;
import com.intern.hrms.repository.job.JobSharingRepository;
import com.intern.hrms.utility.FileStorage;
import com.intern.hrms.utility.MailSend;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Service
public class JobService {

    private final ModelMapper modelMapper;
    private final FileStorage fileStorage;
    private final EmployeeRepository employeeRepository;
    private final JobRepository jobRepository;
    private final JobReferralRepository jobReferralRepository;
    private final MailSend mailSend;
    private final JobSharingRepository jobSharingRepository;

    public JobService(ModelMapper modelMapper, FileStorage fileStorage, EmployeeRepository employeeRepository, JobRepository jobRepository, JobReferralRepository jobReferralRepository, MailSend mailSend, JobSharingRepository jobSharingRepository) {
        this.modelMapper = modelMapper;
        this.fileStorage = fileStorage;
        this.employeeRepository = employeeRepository;
        this.jobRepository = jobRepository;
        this.jobReferralRepository = jobReferralRepository;
        this.mailSend = mailSend;
        this.jobSharingRepository = jobSharingRepository;
    }

    public Job createJob(JobRequestDTO dto, String username){
        Job newJob = new Job();
        modelMapper.map(dto,newJob);
        Employee creator = employeeRepository.getReferenceByEmail(username);
        newJob.setCreatedBy(creator);
        newJob =  jobRepository.save(newJob);

        try {
            if(dto.getJobDescription() != null && !dto.getJobDescription().isEmpty()){
                String url = fileStorage.uploadFile("job-description/","JD_"+newJob.getJobId(),dto.getJobDescription());
                newJob.setJobDescriptionUrl(url);
                jobRepository.save(newJob);
            }
        }catch (IOException exception){
            System.out.println("Issue in file storing for JobId : "+dto.getJobId());
        }
        return newJob;
    }
    public Job updateJob(JobRequestDTO dto){
        Job job = jobRepository.findById(dto.getJobId()).orElseThrow();
        modelMapper.map(dto, job);
        if(dto.getJobDescription() != null) {
            try {
                if (!dto.getJobDescription().isEmpty()) {
                    String url = fileStorage.uploadFile("job-description/", "JD_" + job.getJobId(), dto.getJobDescription());
                    job.setJobDescriptionUrl(url);
                } else {
                    fileStorage.UpdateFile(job.getJobDescriptionUrl(), dto.getJobDescription());
                }
            } catch (IOException exception) {
                System.out.println("Issue in file Uploading for JobId : " + dto.getJobId());
            }
        }
        jobRepository.save(job);
        return job;
    }

    public void jobStatus(boolean isOpen, int jobId){
        Job job = jobRepository.findById(jobId).orElseThrow(
                ()->new RuntimeException("No such job found with id: "+jobId)
        );
        job.setIsOpen(isOpen);
        job.setOpenedAt(LocalDate.now());
        jobRepository.save(job);
    }

    public void jobReferralStatus(UUID jobReferralId, ReferralStatusEnum status){
        JobReferral referral = jobReferralRepository.findById(jobReferralId).orElseThrow();
        referral.setReferralStatus(status);
        jobReferralRepository.save(referral);
    }

    public JobReferral sendJobReferral(JobReferralRequestDTO dto, String username){
        Employee referrer = employeeRepository.getReferenceByEmail(username);
        Job job = jobRepository.getReferenceById(dto.getJobId());
        JobReferral jobReferral = new JobReferral();
        modelMapper.map(dto, jobReferral);
        jobReferral.setReferrer(referrer);
        jobReferral.setJob(job);
        jobReferral.setJobReferralId(UUID.randomUUID());
        if(dto.getResumeFile() == null || dto.getResumeFile().isEmpty())
            throw new RuntimeException("Resume file not attached with referral");
        try{
            String url = fileStorage.uploadFile("resumes/", jobReferral.getJobReferralId().toString(),dto.getResumeFile());
            jobReferral.setResumeUrl(url);
        }catch (IOException e){
            System.out.println("Issue in Uploading resume in file");
        }
        jobReferral.setReferralStatus(ReferralStatusEnum.New);
        jobReferralRepository.save(jobReferral);
        try{

        mailSend.sendTextWithAttachment(job.getCreatedBy().getEmail(),
                "Referral for Job - "+ job.getTitle(),
                "Pleas find Referral for job.\nI am referring this candidate for job\n"
        + "Candidate Name : " + jobReferral.getReferee() + "\nCandidate Email : " + jobReferral.getRefereeEmail() +
                        "\nReferrer : "+jobReferral.getReferrer().getEmail(),
                jobReferral.getResumeUrl()
        );
        }catch (Exception e){
            System.out.println("Error in sending Referral Mail"+e.getMessage());
        }
        return jobReferral;
    }
    public void shareJob(int jobId, String email, String username){
        Job job = jobRepository.findById(jobId).orElseThrow();
        Employee employee = employeeRepository.getReferenceByEmail(email);
        JobSharing jobSharing = new JobSharing(email, job,employee);
        jobSharingRepository.save(jobSharing);
        try{
        mailSend.sendTextWithAttachment(email, "Job Open for - "+job.getTitle(),
                "Hello,\nJob Opening on Roima for position - "+job.getTitle()+
                "\nPlease refer attached Job description for more details"+
                "\nShared By :"+employee.getFirstName()+" "+employee.getLastName(),
                job.getJobDescriptionUrl());
        }catch (Exception e){
            throw new RuntimeException("Error in sharing email : "+e.getMessage());
        }
    }
    public List<JobResponseDTO> getJobs(){
        List<Job> jobs = jobRepository.findAll();
        return modelMapper.map(jobs, new TypeToken<List<JobResponseDTO>>(){}.getType());
    }
    public List<JobResponseDTO> getOpenJobs(){
        List<Job> jobs = jobRepository.findAllByIsOpen(true);
        return modelMapper.map(jobs, new TypeToken<List<JobResponseDTO>>(){}.getType());
    }

    public List<JobReferralResponseDTO> getJobReferralByJob(int jobId){
        List<JobReferral> jobReferrals = jobReferralRepository.findAllByJob_JobId(jobId);
        return modelMapper.map(jobReferrals, new TypeToken<List<JobReferralResponseDTO>>(){}.getType());
    }

    public List<JobReferralResponseDTO> getJobReferralByEmployee(int employeeId){
        List<JobReferral> jobReferrals = jobReferralRepository.findAllByReferrer_EmployeeId(employeeId);
        return modelMapper.map(jobReferrals, new TypeToken<List<JobReferralResponseDTO>>(){}.getType());
    }
}
