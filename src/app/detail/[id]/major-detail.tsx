'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {  BookOpen, School, Users, Info } from "lucide-react"
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface Major {
  category_name: string;
  major_id: string;
  major_name: string;
  subject_id: string;
  subject_name: string;
}

interface RelatedMajors {
  data: Major[];
  pagination: {
    page: number;
    page_size: number;
    total_count: number;
    total_pages: number;
  };
}

export default function MajorDetailPage() {
  const params = useParams()
  const [majorDetails, setMajorDetails] = useState<Major | null>(null)
  const [relatedMajors, setRelatedMajors] = useState<Major[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}:${process.env.NEXT_PUBLIC_BACKEND_PORT}`;

        const detailsResponse = await fetch(`${apiUrl}/api/majors/${params.id}`)
        if (!detailsResponse.ok) throw new Error('Failed to fetch major details')
        const detailsData = await detailsResponse.json()
        setMajorDetails(detailsData)

        const relatedResponse = await fetch(`${apiUrl}/api/majors?subject=${detailsData.subject_id}&page=1&page_size=12`)
        if (!relatedResponse.ok) throw new Error('Failed to fetch related majors')
        const relatedData: RelatedMajors = await relatedResponse.json()
        setRelatedMajors(relatedData.data.filter(major => major.major_id !== detailsData.major_id))
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [params.id])

  if (loading) return <div>Loading...</div>
  if (!majorDetails) return <div>Major not found</div>

  return (
      <main className="container mx-auto px-4 py-12 flex-grow">
        <Link href="/majors" className="text-purple-400 hover:text-purple-300 mb-4 inline-block">
          ← Back to Majors
        </Link>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            <h1 className="text-4xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              {majorDetails.major_name}
            </h1>
            <div className="text-xl text-gray-300 mb-8">
              <p>学科门类: {majorDetails.category_name}</p>
              <p>学科代码: {majorDetails.subject_id}</p>
              <p>学科名称: {majorDetails.subject_name}</p>
            </div>

            <div className="flex space-x-4 mb-8">
              <Button className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white">
                Apply
              </Button>
              <Button variant="outline" className="text-purple-400 border-purple-400 hover:bg-purple-400 hover:text-white">
                Download
              </Button>
              <Button variant="outline" className="text-pink-400 border-pink-400 hover:bg-pink-400 hover:text-white">
                Call
              </Button>
            </div>

            <Card className="bg-gray-800 border-gray-700 mb-8">
              <CardHeader>
                <CardTitle className="flex items-center text-white">
                  <BookOpen className="h-5 w-5 mr-2" />
                  Common Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="grid grid-cols-2 gap-2">
                  {/* Add common courses logic here */}
                </ul>
              </CardContent>
            </Card>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <Users className="h-5 w-5 mr-2 text-purple-400" />
                Related Majors
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 ml-2 text-gray-400 hover:text-gray-300" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-gray-800 text-white p-2">
                      <p>相关专业学科</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                {relatedMajors.map((major) => (
                  <Link 
                    key={major.major_id} 
                    href={`/detail/${major.major_id}`}
                  >
                    <Button 
                      variant="outline" 
                      className="w-full bg-gray-700 text-gray-200 border-purple-400 hover:bg-gray-600"
                    >
                      {major.major_name}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <School className="h-5 w-5 mr-2 text-purple-400" />
                High School Subjects
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <Info className="h-4 w-4 ml-2 text-gray-400 hover:text-gray-300" />
                    </TooltipTrigger>
                    <TooltipContent className="bg-gray-800 text-white p-2">
                      <p>高中阶段学习过的课程</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </h2>
              <div className="flex flex-wrap gap-2">
                <span className="bg-gray-700 text-gray-200 px-3 py-1 rounded-lg text-sm border border-purple-400">
                  数学
                </span>
                <span className="bg-gray-700 text-gray-200 px-3 py-1 rounded-lg text-sm border border-purple-400">
                  物理
                </span>
                <span className="bg-gray-700 text-gray-200 px-3 py-1 rounded-lg text-sm border border-purple-400">
                  化学
                </span>
                <span className="bg-gray-700 text-gray-200 px-3 py-1 rounded-lg text-sm border border-purple-400">
                  生物
                </span>
                <span className="bg-gray-700 text-gray-200 px-3 py-1 rounded-lg text-sm border border-purple-400">
                  地理
                </span>
              </div>
            </div>
          </div>

          <div>
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">专业信息</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <p className="text-gray-300">专业代码: {majorDetails.major_id}</p>
                  <p className="text-gray-300">所属门类: {majorDetails.category_name}</p>
                  <p className="text-gray-300">所属学科: {majorDetails.subject_name}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
  )
}