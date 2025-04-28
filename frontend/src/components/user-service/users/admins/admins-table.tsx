"use client"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Pencil, Trash, Loader2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"

interface AdminsTableProps {
  admins: any[]
  onEdit: (admin: any) => void
  onDelete: (admin: any) => void
  isLoading?: boolean
}

export function AdminsTable({ admins, onEdit, onDelete, isLoading = false }: AdminsTableProps) {
  // Loading skeleton rows
  const LoadingRows = () => (
    <>
      {[1, 2, 3].map((i) => (
        <TableRow key={`loading-${i}`}>
          <TableCell>
            <div className="flex items-center gap-3">
              <Skeleton className="h-10 w-10 rounded-full" />
              <Skeleton className="h-4 w-[150px]" />
            </div>
          </TableCell>
          <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
          <TableCell><Skeleton className="h-4 w-[120px]" /></TableCell>
          <TableCell><Skeleton className="h-6 w-[100px]" /></TableCell>
          <TableCell><Skeleton className="h-8 w-8 rounded-md" /></TableCell>
        </TableRow>
      ))}
    </>
  );

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Admin Type</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <LoadingRows />
          ) : admins.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="h-24 text-center">
                No admins found.
              </TableCell>
            </TableRow>
          ) : (
            admins.map((admin) => (
              <TableRow key={admin.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={admin.profilePicture || "/placeholder.svg"}
                        alt={`${admin.firstName} ${admin.lastName}`}
                      />
                      <AvatarFallback>
                        {admin.firstName[0]}
                        {admin.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <span>
                      {admin.firstName} {admin.lastName}
                    </span>
                  </div>
                </TableCell>
                <TableCell>{admin.email}</TableCell>
                <TableCell>{admin.contactNumber}</TableCell>
                <TableCell>
                  <Badge variant="outline">{admin.adminType}</Badge>
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
                      <DropdownMenuItem onClick={() => onEdit(admin)}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onDelete(admin)}>
                        <Trash className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
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
