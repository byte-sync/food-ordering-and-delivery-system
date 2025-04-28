"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface DeleteUserModalProps {
  open: boolean
  userType: 'admin' | 'restaurant' | 'driver' | 'customer'
  userName: string
  onClose: () => void
  onConfirm: () => void
}

export function DeleteUserModal({ 
  open, 
  userType, 
  userName, 
  onClose, 
  onConfirm 
}: DeleteUserModalProps) {
  const [confirmText, setConfirmText] = useState("")
  const [error, setError] = useState("")
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (confirmText.toLowerCase() !== "delete") {
      setError("Please type 'delete' to confirm")
      return
    }
    onConfirm()
    setConfirmText("")
    setError("")
  }

  const getUserTypeTitle = () => {
    switch(userType) {
      case 'admin': return 'Admin';
      case 'restaurant': return 'Restaurant';
      case 'driver': return 'Driver';
      case 'customer': return 'Customer';
      default: return 'User';
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete {getUserTypeTitle()}</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {userName}? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="confirm-text">Type <strong>delete</strong> to confirm</Label>
              <Input
                id="confirm-text"
                value={confirmText}
                onChange={(e) => {
                  setConfirmText(e.target.value)
                  setError("")
                }}
                placeholder="delete"
                required
              />
              {error && <p className="text-sm text-destructive">{error}</p>}
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="destructive">
              Delete
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}