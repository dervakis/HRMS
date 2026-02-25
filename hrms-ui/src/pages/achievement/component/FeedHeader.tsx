import { Button } from "flowbite-react"
import { Filter, PlusCircle, Trophy } from "lucide-react"

interface FeedHeaderProps {
    onCreatePost: () => void
    onToggleSidebar: () => void
}

export function FeedHeader({ onCreatePost, onToggleSidebar }: FeedHeaderProps) {
    return (
        <header className="backdrop-blur-sm bg-blue-200">
            <div className="flex items-center justify-between px-4 py-3 lg:px-6">
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                        <div className="h-8 w-8 rounded-lg bg-blue-400 flex items-center justify-center">
                            <Trophy className="h-4 w-4 text-primary-foreground" />
                        </div>
                        <div>
                            <h1 className="text-base font-bold text-foreground leading-tight">
                                Achievements Feed
                            </h1>
                            <p className="text-xs text-muted-foreground hidden sm:block">
                                Company social feed & celebrations
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex gap-4">
                    <Button
                        size="sm"
                        className="gap-1.5"
                        onClick={onCreatePost}
                    >
                        <PlusCircle className="h-4 w-4" />
                        <span className="hidden sm:inline">New Post</span>
                    </Button>
                    <Button size="sm" className="rounded-full" onClick={onToggleSidebar} >
                        <Filter size='16'/>
                    </Button>
                </div>
            </div>
        </header>
    )
}