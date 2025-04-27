"use client"

import type React from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProfileImageUploader } from "../../profile/profile-image-uploader"
import { Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { toast } from "sonner"
import axios from "axios"

interface CreateAdminModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (data: any) => void
}

export function CreateAdminModal({ open, onClose, onSubmit }: CreateAdminModalProps) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNumber: "",
    profilePicture: "/placeholder.svg?height=120&width=120",
    adminType: "3rd Level",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleProfileImageUpdate = (imageUrl: string) => {
    setFormData({
      ...formData,
      profilePicture: imageUrl,
    })
  }
  
  const generateTemporaryPassword = () => {
    // Generate a random 10-character password with letters and numbers
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < 10; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
  };

  const sendAdminCredentialsEmail = async (email: string, firstName: string, lastName: string, tempPassword: string) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';
    const AUTH_API = `${API_URL}/auth-service`;
    
    try {
      const subject = 'Your Food Ordering System Admin Account';
      
      const content = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://foodorderingsystem.com/logo.png" alt="Food Ordering System Logo" style="max-width: 150px;">
          </div>
          <h2 style="color: #333;">Welcome to Food Ordering System!</h2>
          <p>Hello ${firstName} ${lastName},</p>
          <p>An administrator account has been created for you in the Food Ordering System.</p>
          <p>Here are your login credentials:</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Temporary Password:</strong> ${tempPassword}</p>
          </div>
          <p>Please log in using the temporary password and change it immediately for security reasons.</p>
          <p>If you have any questions or need assistance, please contact the system administrator.</p>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; color: #777; font-size: 12px;">
            <p>This is an automated message. Please do not reply directly to this email.</p>
            <p>&copy; ${new Date().getFullYear()} Food Ordering System. All rights reserved.</p>
          </div>
        </div>
      `;
      
      await axios.post(`${AUTH_API}/auth/send-email`, {
        to: email,
        subject: subject,
        content: content
      });
      
      return true;
    } catch (error) {
      console.error('Failed to send email:', error);
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Generate temporary password
      const tempPassword = generateTemporaryPassword();
      
      // Submit form data with generated password
      onSubmit({
        ...formData,
        password: tempPassword,
      })
      
      // Send email with credentials to the admin
      const emailSent = await sendAdminCredentialsEmail(
        formData.email,
        formData.firstName,
        formData.lastName,
        tempPassword
      );
      
      toast.success(
        emailSent 
          ? `Admin created successfully. Temporary password sent to ${formData.email}`
          : "Admin created successfully, but email could not be sent",
        {
          description: emailSent 
            ? "The new admin can now log in with the temporary password" 
            : "Please provide the temporary password manually",
        }
      );
      
      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        contactNumber: "",
        profilePicture: "/placeholder.svg?height=120&width=120",
        adminType: "3rd Level",
      })
    } catch (error) {
      console.error("Error creating admin:", error);
      toast.error("Error creating admin", {
        description: "There was a problem creating the admin account. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Admin</DialogTitle>
          <DialogDescription>Add a new administrator to the system.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <Alert className="bg-blue-50 border-blue-200">
              <Info className="h-4 w-4 text-blue-500" />
              <AlertDescription className="text-blue-700">
                A temporary password will be generated and emailed to the admin when you create this account.
              </AlertDescription>
            </Alert>
            
            <div className="flex flex-col items-center space-y-4">
              <ProfileImageUploader currentImage={formData.profilePicture} onImageUpdate={handleProfileImageUpdate} />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" name="lastName" value={formData.lastName} onChange={handleInputChange} required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactNumber">Contact Number</Label>
              <Input
                id="contactNumber"
                name="contactNumber"
                value={formData.contactNumber}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="adminType">Admin Type</Label>
              <Select value={formData.adminType} onValueChange={(value) => handleSelectChange("adminType", value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select admin type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Top Level">Top Level</SelectItem>
                  <SelectItem value="2nd Level">2nd Level</SelectItem>
                  <SelectItem value="3rd Level">3rd Level</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Admin"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
