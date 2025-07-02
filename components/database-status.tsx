interface DatabaseStatusProps {
  loading: boolean
  error: string | null
  memberCount: number
}

export function DatabaseStatus({ loading, error, memberCount }: DatabaseStatusProps) {
  if (error) {
    return (
      <div className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800">
        <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
        Database Connection Error
      </div>
    )
  }

  if (loading) {
    return (
      <div className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-300 border border-yellow-200 dark:border-yellow-800">
        <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2 animate-pulse"></div>
        Connecting to Database...
      </div>
    )
  }

  return (
    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800">
      <div className="w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse"></div>
      Connected to Supabase Database ({memberCount} members)
    </div>
  )
}
