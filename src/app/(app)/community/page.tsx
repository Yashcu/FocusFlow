
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export default function CommunityPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Community Leaderboard</CardTitle>
        <CardDescription>
          This feature is temporarily unavailable. Check back soon!
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-center h-48">
            <p className="text-muted-foreground">Under construction.</p>
        </div>
      </CardContent>
    </Card>
  )
}
