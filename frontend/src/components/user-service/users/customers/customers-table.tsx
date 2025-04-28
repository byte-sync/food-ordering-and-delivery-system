"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Eye, Trash2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface CustomersTableProps {
  customers: any[]
  onViewDetails: (customer: any) => void
  onDelete?: (customer: any) => void
}

export function CustomersTable({ customers, onViewDetails, onDelete }: CustomersTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Join Date</TableHead>
            <TableHead>Orders</TableHead>
            <TableHead className="w-[80px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center">
                No customers found.
              </TableCell>
            </TableRow>
          ) : (
            customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={customer.profilePicture || "/placeholder.svg"}
                        alt={`${customer.firstName} ${customer.lastName}`}
                      />
                      <AvatarFallback>
                        {customer.firstName[0]}
                        {customer.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span>
                      {customer.firstName} {customer.lastName}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.contactNumber}</TableCell>
                <TableCell>{customer.joinDate}</TableCell>
                <TableCell>{customer.ordersCount}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Open menu</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewDetails(customer)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      {onDelete && (
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive" 
                          onClick={() => onDelete(customer)}
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
