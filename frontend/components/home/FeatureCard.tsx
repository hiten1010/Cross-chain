'use client';

import Link from "next/link"

interface FeatureCardProps {
  title: string
  description: string
  icon: React.ComponentType<{ className?: string }>
  href: string
}

export function FeatureCard({ title, description, icon: Icon, href }: FeatureCardProps) {
  return (
    <Link 
      href={href}
      className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-200"
    >
      <div className="flex items-start space-x-4">
        <div className="p-3 bg-indigo-50 rounded-lg">
          <Icon className="w-6 h-6 text-indigo-600" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          <p className="mt-2 text-sm text-gray-600">{description}</p>
        </div>
      </div>
    </Link>
  )
} 