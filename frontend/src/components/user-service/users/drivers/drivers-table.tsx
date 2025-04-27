"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Eye, Pencil, Check, X, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface DriversTableProps {
  drivers: any[]
  onViewDetails: (driver: any) => void
  onEdit: (driver: any) => void
  onApprove: (id: string) => void
  onReject: (id: string) => void
  onDelete?: (driver: any) => void
}

export function DriversTable({ 
  drivers, 
  onViewDetails, 
  onEdit, 
  onApprove, 
  onReject,
  onDelete 
}: DriversTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Vehicle</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {drivers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No drivers found.
              </TableCell>
            </TableRow>
          ) : (
            drivers.map((driver) => (
              <TableRow key={driver.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={driver.profilePicture || "/placeholder.svg"}
                        alt={`${driver.firstName} ${driver.lastName}`}
                      />
                      <AvatarFallback>
                        {driver.firstName[0]}
                        {driver.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span>
                      {driver.firstName} {driver.lastName}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{driver.email}</TableCell>
                <TableCell>{driver.contactNumber}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{driver.vehicleType}</span>
                    {driver.vehicleNumber !== "N/A" && (
                      <span className="text-xs text-muted-foreground">{driver.vehicleNumber}</span>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      driver.status === "Active" ? "default" : driver.status === "Pending" ? "outline" : "destructive"
                    }
                  >
                    {driver.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewDetails(driver)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(driver)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      {driver.status === "Pending" && (
                        <>
                          <DropdownMenuItem onClick={() => onApprove(driver.id)}>
                            <Check className="mr-2 h-4 w-4" />
                            Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onReject(driver.id)}>
                            <X className="mr-2 h-4 w-4" />
                            Reject
                          </DropdownMenuItem>
                        </>
                      )}
                      {onDelete && (
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive" 
                          onClick={() => onDelete(driver)}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}
