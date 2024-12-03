interface Job {
    role: string;
    type: string;
    salary: string;
    link: string;
}
  
interface Company {
Company: string;
jobs: Job[];
}
  
export interface JobData {
    jobs: Company[];
  }