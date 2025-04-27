"use client"

import { useState, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Loader2 } from "lucide-react"
import { CldUploadButton } from "next-cloudinary"
import { toast } from "sonner"

interface ProfileImageUploaderProps {
  currentImage: string
  onImageUpdate: (imageUrl: string) => void
  folder?: string
}

export function ProfileImageUploader({ 
  currentImage, 
  onImageUpdate,
  folder = "food-ordering-system/profiles"
}: ProfileImageUploaderProps) {
  const [isHovering, setIsHovering] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [localImage, setLocalImage] = useState(currentImage)
  
  // Update local image when prop changes
  useEffect(() => {
    if (currentImage !== localImage && !isUploading) {
      setLocalImage(currentImage)
    }
  }, [currentImage, localImage, isUploading])

  // Handle successful upload from Cloudinary
  const handleUploadSuccess = (result: any) => {
    // Extract the secure URL from the Cloudinary upload result
    const imageUrl = result?.info?.secure_url
    
    console.log('Profile image uploaded:', result)
    console.log('Profile image URL:', imageUrl)
    
    if (imageUrl) {
      // Update local state immediately for immediate UI feedback
      setLocalImage(imageUrl)
      // Update the parent component's state
      onImageUpdate(imageUrl)
      toast.success("Profile image updated successfully")
    } else {
      console.error("Failed to get image URL from result:", result)
      toast.error("Failed to update profile image")
    }
    setIsUploading(false)
  }

  // Handle upload error
  const handleUploadError = (error: any) => {
    console.error("Upload error:", error)
    toast.error("An error occurred while uploading the image")
    setIsUploading(false)
  }

  const handleUploadStart = () => {
    setIsUploading(true)
  }

  return (
    <div 
      className="relative" 
      onMouseEnter={() => setIsHovering(true)} 
      onMouseLeave={() => setIsHovering(false)}
    >
      <Avatar className="h-24 w-24">
        <AvatarImage 
          src={localImage || "/placeholder.svg"} 
          alt="Profile" 
          className="object-cover"
          key={localImage} // Force re-render when image changes
        />
        <AvatarFallback>
          {localImage ? "Image" : "User"}
        </AvatarFallback>
      </Avatar>

      <div 
        className={`absolute inset-0 flex items-center justify-center rounded-full bg-black/50 transition-opacity duration-200 ${
          isHovering || isUploading ? "opacity-100" : "opacity-0"
        }`}
      >
        <CldUploadButton
          options={{
            maxFiles: 1,
            resourceType: "image",
            folder: folder,
            clientAllowedFormats: ["png", "jpeg", "jpg", "webp"],
            maxImageFileSize: 2000000, 
            sources: ["local", "camera", "url"],
            showUploadMoreButton: false,
            singleUploadAutoClose: true,
            cropping: true,
            croppingAspectRatio: 1,
            croppingShowDimensions: true
          }}
          onSuccess={handleUploadSuccess}
          onUpload={handleUploadStart}
          onError={handleUploadError}
          className="h-full w-full flex items-center justify-center"
        >
          <div 
            className="h-10 w-10 rounded-full bg-black/50 text-white hover:bg-black/70 flex items-center justify-center cursor-pointer disabled:opacity-50"
            aria-disabled={isUploading}
          >
            {isUploading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Camera className="h-5 w-5" />
            )}
            <span className="sr-only">Change profile picture</span>
          </div>
        </CldUploadButton>
      </div>
    </div>
  )
}
