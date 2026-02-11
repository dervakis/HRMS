package com.intern.hrms.service.job;

import com.intern.hrms.dto.job.request.JobRequestDTO;
import com.intern.hrms.entity.Employee;
import com.intern.hrms.entity.job.Job;
import com.intern.hrms.repository.EmployeeRepository;
import com.intern.hrms.repository.job.JobRepository;
import com.intern.hrms.utility.FileStorage;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class JobService {

    private final ModelMapper modelMapper;
    private final FileStorage fileStorage;
    private final EmployeeRepository employeeRepository;
    private final JobRepository jobRepository;

    public JobService(ModelMapper modelMapper, FileStorage fileStorage, EmployeeRepository employeeRepository, JobRepository jobRepository) {
        this.modelMapper = modelMapper;
        this.fileStorage = fileStorage;
        this.employeeRepository = employeeRepository;
        this.jobRepository = jobRepository;
    }

    public Job createJob(JobRequestDTO dto, String username){
        Job newJob = new Job();
        modelMapper.map(dto,newJob);
        Employee creator = employeeRepository.getReferenceByEmail(username);
        newJob.setCreatedBy(creator);
        newJob =  jobRepository.save(newJob);

        try {
            if(!dto.getJobDescription().isEmpty()){
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
        if(!dto.getJobDescription().isEmpty()){
            try{
                if(job.getJobDescriptionUrl() == null){
                    String url = fileStorage.uploadFile("job-description/","JD_"+job.getJobId(),dto.getJobDescription());
                    job.setJobDescriptionUrl(url);
                }
                else{
                    fileStorage.UpdateFile(job.getJobDescriptionUrl(), dto.getJobDescription());
                }
            }catch (IOException exception){
                System.out.println("Issue in file Uploading for JobId : "+dto.getJobId());
            }
        }
        jobRepository.save(job);
        return job;
    }
}
