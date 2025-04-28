"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { MapPin, Clock, FileText } from "lucide-react"

interface RestaurantDetailsModalProps {
  open: boolean
  restaurant: any
  onClose: () => void
}

export function RestaurantDetailsModal({ open, restaurant, onClose }: RestaurantDetailsModalProps) {
  if (!restaurant) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {restaurant.name}
            <Badge
              variant={
                restaurant.status === "Active" ? "default" : restaurant.status === "Pending" ? "outline" : "destructive"
              }
            >
              {restaurant.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>{restaurant.address}</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="details" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="hours">Hours</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <h4 className="text-sm font-medium">License Number</h4>
                <p className="text-sm text-muted-foreground">{restaurant.licenseNumber}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium">Restaurant Type</h4>
                <p className="text-sm text-muted-foreground">{restaurant.type}</p>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium">Cuisines</h4>
              <div className="mt-1 flex flex-wrap gap-2">
                {restaurant.cuisines.map((cuisine: string, index: number) => (
                  <Badge key={index} variant="secondary">
                    {cuisine}
                  </Badge>
                ))}
              </div>
            </div>

            <div>
              <h4 className="flex items-center gap-2 text-sm font-medium">
                <MapPin className="h-4 w-4" />
                Location
              </h4>
              <div className="mt-2 h-[200px] rounded-md bg-muted">
                {/* Map would be rendered here */}
                <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                  Map View: {restaurant.location.lat}, {restaurant.location.lng}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="hours" className="pt-4">
            <div className="space-y-4">
              <h4 className="flex items-center gap-2 text-sm font-medium">
                <Clock className="h-4 w-4" />
                Opening Hours
              </h4>
              <ScrollArea className="h-[200px]">
                <div className="space-y-2">
                  {restaurant.openingTimes.map((time: any, index: number) => (
                    <div key={index} className="flex justify-between">
                      <span className="font-medium">{time.day}</span>
                      <span className="text-muted-foreground">
                        {time.open} - {time.close}
                      </span>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>

          <TabsContent value="documents" className="pt-4">
            <div className="space-y-4">
              <h4 className="flex items-center gap-2 text-sm font-medium">
                <FileText className="h-4 w-4" />
                Documents
              </h4>
              <ScrollArea className="h-[200px]">
                <div className="space-y-4">
                  {restaurant.documents.map((doc: any, index: number) => (
                    <div key={index} className="flex items-center justify-between">
                      <span className="font-medium">{doc.name}</span>
                      <Button variant="outline" size="sm" asChild>
                        <a href={doc.url} target="_blank" rel="noopener noreferrer">
                          View
                        </a>
                      </Button>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
