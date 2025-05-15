'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { formSchema, FormData } from '../lib/schemas'
import { useRouter } from 'next/navigation'

// Import shadcn/ui components
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'

export default function LandingPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()
  
  // Initialize react-hook-form with zod schema
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      workExperience: '',
      industryExperience: '',
      motivation: '',
      networkingChallenge: '',
    },
  })

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true)
    
    try {
      const response = await fetch('/api/generate-guide', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.message || 'Failed to generate guide')
      }
      
      console.log('Success:', result)
      
      // Redirect to the guide page using the ID returned from the API
      if (result.guideId) {
        router.push(`/guide/${result.guideId}`)
      }
      
    } catch (error) {
      console.error('Error submitting form:', error)
      // In a real app, we might show a toast notification here
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl md:text-6xl bg-gradient-to-r from-[#FF6B6B] to-[#4D96FF] bg-clip-text text-transparent">
            Coffee-Chat Coach
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Tell us a bit about yourself to get your personalized networking guide!
          </p>
        </div>

        {/* Form */}
        <div className="bg-white shadow overflow-hidden rounded-lg p-6 border border-gray-200">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Name field */}
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Email field */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="your.email@example.com" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Work Experience field */}
              <FormField
                control={form.control}
                name="workExperience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work Experience</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Briefly describe your work experience" 
                        className="resize-none" 
                        rows={3}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Industry Experience field */}
              <FormField
                control={form.control}
                name="industryExperience"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Industry Experience</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="What industries have you worked in?" 
                        className="resize-none" 
                        rows={3}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Motivation field */}
              <FormField
                control={form.control}
                name="motivation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Motivation</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="What motivates you to network and connect with others?" 
                        className="resize-none" 
                        rows={3}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Networking Challenge field */}
              <FormField
                control={form.control}
                name="networkingChallenge"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Networking Challenge</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="What challenges do you face when networking?" 
                        className="resize-none" 
                        rows={3}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Submit button */}
              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 sm:py-6 bg-gradient-to-r from-[#FFA93A] to-[#FF6B6B] hover:from-[#FF6B6B] hover:to-[#FFA93A] text-slate-900 font-medium rounded-md"
                >
                  {isSubmitting ? 'Processing...' : 'Get My Guide'}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  )
}
