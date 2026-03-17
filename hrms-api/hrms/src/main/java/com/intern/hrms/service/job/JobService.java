package com.intern.hrms.service.job;

import com.intern.hrms.dto.job.request.JobReferralRequestDTO;
import com.intern.hrms.dto.job.request.JobRequestDTO;
import com.intern.hrms.dto.job.response.JobReferralResponseDTO;
import com.intern.hrms.dto.job.response.JobResponseDTO;
import com.intern.hrms.entity.AppConfiguration;
import com.intern.hrms.entity.Employee;
import com.intern.hrms.entity.job.Job;
import com.intern.hrms.entity.job.JobReferral;
import com.intern.hrms.entity.job.JobSharing;
import com.intern.hrms.enums.ReferralStatusEnum;
import com.intern.hrms.repository.general.AppConfigurationRepository;
import com.intern.hrms.repository.general.EmployeeRepository;
import com.intern.hrms.repository.job.JobReferralRepository;
import com.intern.hrms.repository.job.JobRepository;
import com.intern.hrms.repository.job.JobSharingRepository;
import com.intern.hrms.utility.IFileStorageService;
import com.intern.hrms.utility.IMailService;
import lombok.AllArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.TypeToken;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Service
@AllArgsConstructor
public class JobService {

    private final ModelMapper modelMapper;
    private final IFileStorageService fileStorageService;
    private final EmployeeRepository employeeRepository;
    private final JobRepository jobRepository;
    private final JobReferralRepository jobReferralRepository;
    private final IMailService mailService;
    private final JobSharingRepository jobSharingRepository;
    private final AppConfigurationRepository  appConfigurationRepository;

    public JobResponseDTO createJob(JobRequestDTO dto, String username){
        Job newJob = new Job();
        modelMapper.map(dto,newJob);
        Employee creator = employeeRepository.getReferenceByEmail(username);
        newJob.setCreatedBy(creator);
        newJob =  jobRepository.save(newJob);
         if(dto.getJobDescription() != null && !dto.getJobDescription().isEmpty()){
                String url = fileStorageService.uploadFile("job-description/","JD_"+newJob.getJobId(),dto.getJobDescription());
                newJob.setJobDescriptionUrl(url);
                jobRepository.save(newJob);
            }
        return modelMapper.map(newJob, JobResponseDTO.class);
    }
    public JobResponseDTO updateJob(JobRequestDTO dto){
        Job job = jobRepository.findById(dto.getJobId()).orElseThrow();
        modelMapper.map(dto, job);
        if(dto.getJobDescription() != null) {
                if (!dto.getJobDescription().isEmpty()) {
                    String url = fileStorageService.uploadFile("job-description/", "JD_" + job.getJobId(), dto.getJobDescription());
                    job.setJobDescriptionUrl(url);
                } else {
                    fileStorageService.updateFile(job.getJobDescriptionUrl(), dto.getJobDescription());
                }
        }
        jobRepository.save(job);
        JobResponseDTO res = modelMapper.map(job, JobResponseDTO.class);
        res.setReferralCount(job.getJobReferrals().size());
        return res;
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
        try{
            Employee referrer = employeeRepository.getReferenceByEmail(username);
            Job job = jobRepository.getReferenceById(dto.getJobId());
            JobReferral jobReferral = new JobReferral();
            modelMapper.map(dto, jobReferral);
            jobReferral.setReferrer(referrer);
            jobReferral.setJob(job);
            jobReferral.setJobReferralId(UUID.randomUUID());
            if(dto.getResumeFile() == null || dto.getResumeFile().isEmpty())
                throw new RuntimeException("Resume file not attached with referral");
            String url = fileStorageService.uploadFile("resumes/", jobReferral.getJobReferralId().toString(),dto.getResumeFile());
            jobReferral.setResumeUrl(url);
            jobReferral.setReferralStatus(ReferralStatusEnum.New);
            jobReferralRepository.save(jobReferral);
            List<String> emails = appConfigurationRepository.findByConfigKey("referral_to").stream().map(AppConfiguration::getConfigValue).toList();
            mailService.sendMail(emails,null,
                    "Referral for Job - "+ job.getTitle(),
                    "Pleas find Referral for job.\nI am referring this candidate for job\n"
            + "Candidate Name : " + jobReferral.getReferee() + "\nCandidate Email : " + jobReferral.getRefereeEmail() +
                            "\nReferrer : "+jobReferral.getReferrer().getEmail(),
                    dto.getResumeFile().getBytes(),
                    url.substring(url.lastIndexOf("/")+1),
                    dto.getResumeFile().getContentType()
            );
            return jobReferral;
        }catch (Exception e){
            throw new RuntimeException("Issue on file reading : " + e.getMessage());
        }
    }
    public void shareJob(int jobId, List<String> emails, String username){
        Job job = jobRepository.findById(jobId).orElseThrow();
        Employee employee = employeeRepository.getReferenceByEmail(username);
        Set<JobSharing> sharings = new HashSet<>();
        for(String email : emails){
            sharings.add(new JobSharing(email, job, employee));
        }
        jobSharingRepository.saveAll(sharings);
        mailService.sendMail(emails, null, "Job Open for - "+job.getTitle(),
                "Hello,\nJob Opening on Roima for position - "+job.getTitle()+
                "\nPlease refer attached Job description for more details"+
                "\nShared By :"+employee.getFirstName()+" "+employee.getLastName(),
                fileStorageService.downloadContent(job.getJobDescriptionUrl()),
                job.getJobDescriptionUrl().substring(job.getJobDescriptionUrl().lastIndexOf("/")+1),
                MediaType.ALL_VALUE
                );
    }
    public List<JobResponseDTO> getJobs(){
        List<Job> jobs = jobRepository.findAll();
        return jobs.stream().map(job -> {
            JobResponseDTO ret = modelMapper.map(job, JobResponseDTO.class);
            if(job.getJobReferrals() != null)
                ret.setReferralCount(job.getJobReferrals().size());
            return ret;
        }).toList();
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
