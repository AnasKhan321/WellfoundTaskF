'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MoonLoader } from "react-spinners"
import { JobData } from './interface'
import { motion } from "framer-motion"
import { Moon, Sun } from 'lucide-react'

// Host url
const BackendHost = import.meta.env.VITE_BACKEND_HOST

export default function JobScraper() {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [jobData, setJobData] = useState<JobData | null>(null)
  const [selectedRole, setSelectedRole] = useState<string>('android-developer')
  const [isDarkMode, setIsDarkMode] = useState<boolean>(false)

  const availableRoles: string[] = [
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

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  return (
    <div className={`min-h-screen p-4 transition-colors duration-200 ${isDarkMode ? 'dark bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold  ">AngelList Job Scraper</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsDarkMode(!isDarkMode)}
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <Sun className="h-6 w-6" /> : <Moon className="h-6 w-6" />}
          </Button>
        </div>
        
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
            <MoonLoader color={isDarkMode ? "#ffffff" : "#000000"} /> 
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {jobData && jobData.jobs.map((company, companyIndex) => (
              <motion.div
                key={companyIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: companyIndex * 0.1 }}
              >
                <Card className={`flex flex-col h-full hover:shadow-lg transition-shadow duration-200 ${isDarkMode ? 'bg-gray-800 text-white' : 'bg-white'}`}>
                  <CardHeader>
                    <CardTitle className="text-xl font-bold">{company.Company}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    {company.jobs.map((job, jobIndex) => (
                      <div key={jobIndex} className="mb-4 last:mb-0">
                        <h3 className="font-semibold text-lg">{job.role}</h3>
                        <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{job.type}</p>
                        <p className="text-sm font-medium">{job.salary}</p>
                        <Button 
                          variant="link" 
                          className={`p-0 h-auto font-normal ${isDarkMode ? 'text-blue-400 hover:text-blue-300' : 'text-blue-500 hover:text-blue-700'}`}
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
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  )
}

