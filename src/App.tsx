import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {MoonLoader } from "react-spinners"
import { JobData } from './interface'

// Host url
const BackendHost = import.meta.env.VITE_BACKEND_HOST;


function App() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [jobData, setJobData] = useState<JobData | null>(null)
  const [selectedRole, setSelectedRole] = useState<string>('android-developer')

  const availableRoles  : string[] = [
    'android-developer',
    'engineering-manager',
    'artificial-intelligence-engineer',
    'full-stack-engineer'

  ]

  

  const fetchData = async (role: string) => {
    try {
      setIsLoading(true)
      const res = await fetch(`${BackendHost}/api/${role}`)
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`)
      }
      const data: JobData = await res.json()
      setJobData(data)
    } catch (error) {
      console.error("Fetching job data failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData(selectedRole)
  }, [selectedRole])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">AngelList Job Scraper</h1>
      
      <div className="mb-6">
        <Select value={selectedRole} onValueChange={setSelectedRole}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a role" />
          </SelectTrigger>
          <SelectContent>
            {availableRoles.map((role) => (
              <SelectItem key={role} value={role}>
                {role.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <MoonLoader/> 
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobData && jobData.jobs.map((company, companyIndex) => (
            <Card key={companyIndex} className="flex flex-col">
              <CardHeader>
                <CardTitle className="text-xl font-bold">{company.Company}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                {company.jobs.map((job, jobIndex) => (
                  <div key={jobIndex} className="mb-4 last:mb-0">
                    <h3 className="font-semibold text-lg">{job.role}</h3>
                    <p className="text-sm text-gray-600">{job.type}</p>
                    <p className="text-sm font-medium">{job.salary}</p>
                    <Button 
                      variant="link" 
                      className="p-0 h-auto font-normal text-blue-500 hover:text-blue-700"
                      asChild
                    >
                      <a href={`https://angel.co${job.link}`} target="_blank" rel="noopener noreferrer">
                        View Job
                      </a>
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

export default App

