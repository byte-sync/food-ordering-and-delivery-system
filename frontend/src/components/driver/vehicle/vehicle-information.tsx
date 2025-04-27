"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { DocumentUploader } from "@/components/shared/document-uploader"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"
import { toast } from "sonner"

interface Document {
  name: string;
  url: string;
}

interface VehicleData {
  type: string;
  model: string;
  year: string;
  color: string;
  licensePlate: string;
  documents: Document[];
}

// Sample data - in a real app this would come from an API
const SAMPLE_VEHICLE_DATA: VehicleData = {
  type: "Sedan",
  model: "Toyota Corolla",
  year: "2020",
  color: "Silver",
  licensePlate: "ABC-1234",
  documents: [
    { name: "Vehicle Registration", url: "" },
    { name: "Vehicle Insurance", url: "" },
    { name: "Driver's License", url: "" }
  ]
};

const VEHICLE_TYPES = [
  "Motorcycle", 
  "Compact Car", 
  "Sedan", 
  "SUV", 
  "Van", 
  "Pickup Truck",
  "Bicycle",
  "Electric Scooter"
];

export function VehicleInformation() {
  const [loading, setLoading] = useState(false);
  const [vehicleData, setVehicleData] = useState<VehicleData>(SAMPLE_VEHICLE_DATA);
  const [formData, setFormData] = useState<VehicleData>(SAMPLE_VEHICLE_DATA);

  // Mimics data fetching from API
  useEffect(() => {
    // In a real implementation, this would be an API call
    setFormData(vehicleData);
  }, [vehicleData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleVehicleTypeChange = (value: string) => {
    setFormData({
      ...formData,
      type: value
    });
  };

  const handleDocumentUpdate = (index: number, document: { name: string; url: string }) => {
    // Create a fresh copy of documents array
    const updatedDocuments = [...formData.documents];
    updatedDocuments[index] = document;

    // Update formData state with new documents array
    setFormData({
      ...formData,
      documents: updatedDocuments
    });
    
    // Also update the original data to ensure it persists
    setVehicleData(prevState => ({
      ...prevState,
      documents: updatedDocuments
    }));
  };

  const handleAddDocument = () => {
    setFormData({
      ...formData,
      documents: [...formData.documents, { name: "Additional Document", url: "" }]
    });
  };

  const handleRemoveDocument = (index: number) => {
    const updatedDocuments = [...formData.documents];
    updatedDocuments.splice(index, 1);

    setFormData({
      ...formData,
      documents: updatedDocuments
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Validate if all documents have been uploaded
    const missingDocuments = formData.documents.some(doc => !doc.url || doc.url.trim() === "");
    
    if (missingDocuments) {
      toast.error("Please upload all required documents");
      setLoading(false);
      return;
    }
    
    // Simulate API call
    setTimeout(() => {
      setVehicleData(formData);
      setLoading(false);
      toast.success("Vehicle information updated successfully");
    }, 1000);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vehicle Information</CardTitle>
        <CardDescription>
          Update your vehicle information and documentation
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="type">Vehicle Type</Label>
              <Select 
                value={formData.type} 
                onValueChange={handleVehicleTypeChange}
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select vehicle type" />
                </SelectTrigger>
                <SelectContent>
                  {VEHICLE_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Vehicle Model</Label>
              <Input
                id="model"
                name="model"
                value={formData.model}
                onChange={handleInputChange}
                placeholder="e.g. Toyota Corolla"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year">Year of Manufacture</Label>
              <Input
                id="year"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                placeholder="e.g. 2020"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="color">Vehicle Color</Label>
              <Input
                id="color"
                name="color"
                value={formData.color}
                onChange={handleInputChange}
                placeholder="e.g. Silver"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="licensePlate">License Plate</Label>
              <Input
                id="licensePlate"
                name="licensePlate"
                value={formData.licensePlate}
                onChange={handleInputChange}
                placeholder="e.g. ABC-1234"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Vehicle Documents</Label>
              <Button 
                type="button" 
                variant="outline" 
                size="sm" 
                onClick={handleAddDocument}
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Document
              </Button>
            </div>

            <div className="space-y-3">
              {formData.documents.map((document, index) => (
                <DocumentUploader
                  key={index}
                  documentName={document.name}
                  currentDocument={document}
                  onDocumentUpdate={(doc) => handleDocumentUpdate(index, doc)}
                  folder="food-ordering-system/vehicle-documents"
                  editable={true}
                />
              ))}

              {formData.documents.length === 0 && (
                <div className="flex h-20 items-center justify-center rounded-lg border border-dashed">
                  <p className="text-sm text-muted-foreground">
                    No documents added
                  </p>
                </div>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : "Save Vehicle Information"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}