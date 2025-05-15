'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'

interface ClientNavButtonProps {
  targetPath: string
  buttonText: string
  className?: string
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

export default function ClientNavButton({
  targetPath,
  buttonText,
  className,
  variant = "default",
  size = "default"
}: ClientNavButtonProps) {
  const router = useRouter()

  return (
    <Button
      onClick={() => router.push(targetPath)}
      className={className}
      variant={variant}
      size={size}
    >
      {buttonText}
    </Button>
  )
}
