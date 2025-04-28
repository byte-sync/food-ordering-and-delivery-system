"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { FileText, Upload, X, Check, Loader2, Download } from "lucide-react"
import { CldUploadButton } from "next-cloudinary"
import { toast } from "sonner"
import { generateDocumentId } from "@/utils/id-generator"

interface DocumentInfo {
  id?: string
  name: string
  url: string
}

interface DocumentUploaderProps {
  documentName: string
  currentDocument: DocumentInfo
  onDocumentUpdate: (document: DocumentInfo) => void
  folder: string
  editable?: boolean
  classname?: string
}

export function DocumentUploader({
  documentName,
  currentDocument,
  onDocumentUpdate,
  folder = "food-ordering-system/documents",
  editable = true,
  classname = ""
}: DocumentUploaderProps) {
  const [isUploading, setIsUploading] = useState(false)
  const [isEditingName, setIsEditingName] = useState(false)
  const [editName, setEditName] = useState(documentName)

  // Update local state when the document name prop changes
  useEffect(() => {
    setEditName(currentDocument.name || documentName)
  }, [currentDocument.name, documentName])
  
  const handleUploadSuccess = (result: any) => {
    const documentUrl = result?.info?.secure_url
    
    console.log('Document uploaded result:', result)
    console.log('Document URL:', documentUrl)
    
    if (documentUrl) {
      // Create a new document object to ensure state is properly updated
      // Use the document's current name to prevent name switching
      const updatedDocument = {
        id: generateDocumentId(),
        name: currentDocument.name || editName,
        url: documentUrl
      }
      
      // Call the parent component's update function with the new document
      onDocumentUpdate(updatedDocument)
      toast.success(`${currentDocument.name || editName} uploaded successfully`)
    } else {
      console.error("Failed to get document URL from result:", result)
      toast.error(`Failed to upload ${currentDocument.name || editName}`)
    }
    
    setIsUploading(false)
  }

  const handleUploadError = (error: any) => {
    console.error("Document upload error:", error)
    toast.error(`An error occurred while uploading ${currentDocument.name || editName}`)
    setIsUploading(false)
  }
  
  const handleUploadStart = () => {
    setIsUploading(true)
  }

  const openDocument = () => {
    if (currentDocument.url) {
      window.open(currentDocument.url, '_blank')
    }
  }

  const handleNameSave = () => {
    if (editName.trim()) {
      onDocumentUpdate({
        ...currentDocument,
        id: currentDocument.id || generateDocumentId(), // Ensure document has an ID
        name: editName
      })
      setIsEditingName(false)
    }
  }

  return (
    <div className={`relative flex items-center p-3 border rounded-md ${classname}`}>
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
        <FileText className="w-4 h-4 text-primary" />
      </div>
      
      <div className="flex-grow ml-3">
        {isEditingName ? (
          <div className="flex items-center gap-1">
            <Input 
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              className="h-7 py-0 text-sm"
              autoFocus
              onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
            />
            <Button
              type="button" 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0" 
              onClick={handleNameSave}
            >
              <Check className="w-4 h-4 text-primary" />
              <span className="sr-only">Save name</span>
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-1">
            <Label className="text-sm font-medium">
              {currentDocument.name}
            </Label>
            {(documentName.includes('Additional Document') || currentDocument.name !== "Business License" && currentDocument.name !== "Food Safety Certificate") && editable && (
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                className="h-5 w-5 p-0 ml-1 text-muted-foreground hover:text-primary" 
                onClick={() => setIsEditingName(true)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"/>
                </svg>
                <span className="sr-only">Edit name</span>
              </Button>
            )}
          </div>
        )}
        <p className="text-xs text-muted-foreground truncate max-w-[200px]">
          {currentDocument.url ? "Document uploaded" : "No document uploaded yet"}
        </p>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {currentDocument.url && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="text-primary hover:text-primary/80"
            onClick={openDocument}
          >
            <Download className="w-4 h-4" />
            <span className="sr-only">View document</span>
          </Button>
        )}

        {editable && (
          <CldUploadButton
            options={{
              maxFiles: 1,
              resourceType: "auto",
              folder: folder,
              clientAllowedFormats: ["pdf", "png", "jpg", "jpeg", "doc", "docx"],
              maxFileSize: 5000000, // 5MB
              sources: ["local", "url"],
              showUploadMoreButton: false,
              singleUploadAutoClose: true,
            }}
            onSuccess={(result) => {
              setIsUploading(false);
              handleUploadSuccess(result);
            }}
            onError={(error) => {
              setIsUploading(false);
              handleUploadError(error);
            }}
            onUpload={handleUploadStart}
            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "food_ordering_app"}
            className="h-auto p-0"
          >
            <div 
              className={`inline-flex items-center justify-center gap-2 px-2 py-1 text-sm font-medium rounded-md cursor-pointer ${
                isUploading ? 'opacity-70 pointer-events-none' : ''
              } ${
                currentDocument.url 
                  ? 'text-muted-foreground hover:bg-accent hover:text-accent-foreground' 
                  : 'bg-primary text-primary-foreground hover:bg-primary/90'
              }`}
              aria-disabled={isUploading}
            >
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : currentDocument.url ? (
                <>
                  <Upload className="w-4 h-4 mr-1" />
                  <span>Replace</span>
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4 mr-1" />
                  <span>Upload</span>
                </>
              )}
            </div>
          </CldUploadButton>
        )}

        {currentDocument.url && (
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-green-600">
            <Check className="h-3 w-3" />
          </span>
        )}
      </div>
    </div>
  )
}