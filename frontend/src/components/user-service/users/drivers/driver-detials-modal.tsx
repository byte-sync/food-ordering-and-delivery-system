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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileText, Car } from "lucide-react"

interface DriverDetailsModalProps {
  open: boolean
  driver: any
  onClose: () => void
}

export function DriverDetailsModal({ open, driver, onClose }: DriverDetailsModalProps) {
  if (!driver) return null

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {driver.firstName} {driver.lastName}
            <Badge
              variant={driver.status === "Active" ? "default" : driver.status === "Pending" ? "outline" : "destructive"}
            >
              {driver.status}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            {driver.email} • {driver.contactNumber}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={driver.profilePicture || "/placeholder.svg"}
              alt={`${driver.firstName} ${driver.lastName}`}
            />
            <AvatarFallback>
              {driver.firstName[0]}
              {driver.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="text-lg font-medium">
              {driver.firstName} {driver.lastName}
            </h3>
            <p className="text-sm text-muted-foreground">{driver.email}</p>
            <p className="text-sm text-muted-foreground">{driver.contactNumber}</p>
          </div>
        </div>

        <Tabs defaultValue="vehicle" className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="vehicle">Vehicle</TabsTrigger>
            <TabsTrigger value="documents">Documents</TabsTrigger>
          </TabsList>

          <TabsContent value="vehicle" className="space-y-4 pt-4">
            <div className="space-y-2">
              <h4 className="flex items-center gap-2 text-sm font-medium">
                <Car className="h-4 w-4" />
                Vehicle Information
              </h4>
              <div className="rounded-md border p-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Vehicle Type</p>
                    <p className="text-sm text-muted-foreground">{driver.vehicleType}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Vehicle Number</p>
                    <p className="text-sm text-muted-foreground">{driver.vehicleNumber}</p>
                  </div>
                </div>
              </div>
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
                  {driver.documents.map((doc: any, index: number) => (
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
