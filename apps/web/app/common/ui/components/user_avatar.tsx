import { cn } from '@workspace/ui/lib/utils'

import { Avatar, AvatarFallback, AvatarImage } from '@workspace/ui/components/avatar'

export interface NavUserProps {
  user: {
    fullName: string | null | undefined
    email: string
    avatarUrl: string | null | undefined
  }
  className?: string
}

function generateFallbackText(user: { name?: string; fullName?: string | null; email: string }): string {
  const name = user.fullName || user.name
  if (name) {
    const initials = name
      .split(' ')
      .filter((word) => word.length > 0)
      .map((word) => word[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
    return initials
  }
  return user.email.slice(0, 2).toUpperCase()
}

export function UserAvatar({ user, className }: NavUserProps) {
  const fallbackText = generateFallbackText(user)

  return (
    <Avatar className={cn('h-8 w-8', className)}>
      <AvatarImage src={user.avatarUrl ?? undefined} alt={user.fullName ?? undefined} />
      <AvatarFallback className="rounded-lg">{fallbackText}</AvatarFallback>
    </Avatar>
  )
}
