'use client';

interface StatsCardProps {
  title: string
  value: string
  subValue?: string
}

export function StatsCard({ title, value, subValue }: StatsCardProps) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm">
      <h3 className="text-sm font-medium text-gray-600">{title}</h3>
      <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
      {subValue && (
        <p className="mt-1 text-sm text-gray-500">{subValue}</p>
      )}
    </div>
  )
} 