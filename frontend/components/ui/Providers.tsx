// components/ui/Providers.tsx

'use client'

import React from 'react'
import { TooltipProvider } from '@/components/ui/tooltip' // Adjust the path based on your project structure
import { CourseProvider } from '@/app/CourseContext' // Adjust if necessary

interface ProvidersProps {
  children: React.ReactNode
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <TooltipProvider>
      <CourseProvider>
        {children}
      </CourseProvider>
    </TooltipProvider>
  )
}

export default Providers
