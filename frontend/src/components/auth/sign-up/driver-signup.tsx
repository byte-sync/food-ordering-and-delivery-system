"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FileText, Car, MapPin, Check, Upload, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Modal } from "@/components/auth/modal"
import { MapSelector } from "@/components/ui/map-selector"
import { DocumentUploader } from "@/components/shared/document-uploader"
import { userService, VehicleType } from "@/services/user-service"

interface DriverSignUpProps {
  userData: {
    email: string
    firstName: string
    lastName: string
    phone: string
    profileImage: string | null
    password: string
  }
}

export function DriverSignUp({ userData }: DriverSignUpProps) {
  // Vehicle info state
  const [vehicleType, setVehicleType] = useState("")
  const [vehicleTypeText, setVehicleTypeText] = useState("") // To display selected vehicle type name
  const [licensePlate, setLicensePlate] = useState("")
  const [vehicleTypes, setVehicleTypes] = useState<VehicleType[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showVehicleSelector, setShowVehicleSelector] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  
  // Document states - manage each document independently
  const [driversLicense, setDriversLicense] = useState<{ name: string; url: string }>({ name: "Driver's License", url: "" })
  const [vehicleRegistration, setVehicleRegistration] = useState<{ name: string; url: string }>({ name: "Vehicle Registration", url: "" })
  const [vehicleInsurance, setVehicleInsurance] = useState<{ name: string; url: string }>({ name: "Vehicle Insurance", url: "" })
  // Store additional documents in an array
  const [additionalDocuments, setAdditionalDocuments] = useState<{ name: string; url: string }[]>([])
  
  // Location state
  const [location, setLocation] = useState("")
  const [locationConfirmed, setLocationConfirmed] = useState(false)
  
  // UI state
  const [showMap, setShowMap] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  // Fetch vehicle types on component mount
  useEffect(() => {
    const fetchVehicleTypes = async () => {
      setIsLoading(true);
      try {
        const types = await userService.getVehicleTypes();
        setVehicleTypes(types);
      } catch (error) {
        console.error("Failed to fetch vehicle types:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchVehicleTypes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      try {
        // Format data for registration
        const registrationData = {
          // Common user data
          email: userData.email,
          password: userData.password,
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
          profilePictureUrl: userData.profileImage, // Changed from profileImage to profilePictureUrl
          
          // Driver specific data
          vehicleTypeId: vehicleType,
          licensePlate: licensePlate,
          documents: [
            driversLicense,
            vehicleRegistration,
            vehicleInsurance,
            ...additionalDocuments
          ],
          location: location,
          // Add coordinates if available from your map component
        }

        // Call the registration service
        await userService.register(registrationData, "driver")
        
        // Show success modal
        setShowSuccessModal(true)
      } catch (error: any) {
        console.error("Registration failed:", error)
        setErrors({
          ...errors,
          general: error.response?.data?.message || "Registration failed. Please try again."
        })
      }
    }
  }

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}
    let isValid = true
    
    if (!vehicleType) {
      newErrors.vehicleType = "Vehicle type is required"
      isValid = false
    }
    
    if (!licensePlate) {
      newErrors.licensePlate = "License plate is required"
      isValid = false
    }
    
    const missingDocuments = !driversLicense.url || !vehicleRegistration.url || !vehicleInsurance.url || additionalDocuments.some((doc) => !doc.url || doc.url.trim() === "")
    if (missingDocuments) {
      newErrors.documents = "All documents are required"
      isValid = false
    }
    
    if (!location) {
      newErrors.location = "Location is required"
      isValid = false
    }
    
    if (!locationConfirmed) {
      newErrors.locationConfirmed = "Please confirm your location on the map"
      isValid = false
    }
    
    setErrors(newErrors)
    return isValid
  }

  const updateAdditionalDocument = (index: number, documentInfo: { name: string; url: string }) => {
    const updatedDocuments = [...additionalDocuments];
    updatedDocuments[index] = documentInfo;
    setAdditionalDocuments(updatedDocuments);
  }

  const addDocument = () => {
    setAdditionalDocuments([...additionalDocuments, { name: "Additional Document", url: "" }])
  }

  const confirmLocationSelection = () => {
    setLocationConfirmed(true)
    setShowMap(false)
  }

  // Filter vehicle types based on search query
  const filteredVehicleTypes = vehicleTypes.filter(type => 
    type.type.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectVehicleType = (id: string, typeName: string) => {
    setVehicleType(id)
    setVehicleTypeText(typeName)
    setShowVehicleSelector(false)
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24,
      },
    },
  }

  return (
    <>
      <motion.form
        onSubmit={handleSubmit}
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div className="space-y-4" variants={itemVariants}>
          <Label htmlFor="vehicleType" className="text-sm font-medium">
            Vehicle Type
          </Label>
          <div className="relative">
            <Car className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="vehicleType"
              placeholder={isLoading ? "Loading vehicle types..." : "Select your vehicle type"}
              className={`pl-10 ${errors.vehicleType ? "border-red-500" : ""} cursor-pointer`}
              value={vehicleTypeText}
              readOnly
              onClick={() => !isLoading && setShowVehicleSelector(true)}
            />
          </div>
          {errors.vehicleType && (
            <motion.p className="text-sm text-red-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {errors.vehicleType}
            </motion.p>
          )}
        </motion.div>

        <motion.div className="space-y-4" variants={itemVariants}>
          <Label htmlFor="licensePlate" className="text-sm font-medium">
            License Plate Number
          </Label>
          <div className="relative">
            <Car className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="licensePlate"
              placeholder="e.g., ABC 1234"
              className={`pl-10 ${errors.licensePlate ? "border-red-500" : ""}`}
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value)}
            />
          </div>
          {errors.licensePlate && (
            <motion.p className="text-sm text-red-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {errors.licensePlate}
            </motion.p>
          )}
        </motion.div>

        <motion.div className="space-y-4" variants={itemVariants}>
          <div className="flex items-center justify-between">
            <Label className="text-sm font-medium">Upload Documents</Label>
            {errors.documents && (
              <motion.span className="text-sm text-red-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {errors.documents}
              </motion.span>
            )}
          </div>

          <div className="space-y-3">
            <DocumentUploader
              documentName={driversLicense.name}
              currentDocument={driversLicense}
              onDocumentUpdate={(documentInfo) => setDriversLicense(documentInfo)}
              folder="food-ordering-system/driver-documents"
            />
            <DocumentUploader
              documentName={vehicleRegistration.name}
              currentDocument={vehicleRegistration}
              onDocumentUpdate={(documentInfo) => setVehicleRegistration(documentInfo)}
              folder="food-ordering-system/driver-documents"
            />
            <DocumentUploader
              documentName={vehicleInsurance.name}
              currentDocument={vehicleInsurance}
              onDocumentUpdate={(documentInfo) => setVehicleInsurance(documentInfo)}
              folder="food-ordering-system/driver-documents"
            />
            {additionalDocuments.map((doc, index) => (
              <DocumentUploader
                key={index}
                documentName={doc.name}
                currentDocument={doc}
                onDocumentUpdate={(documentInfo) => updateAdditionalDocument(index, documentInfo)}
                folder="food-ordering-system/driver-documents"
              />
            ))}

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={addDocument}
            >
              <Upload className="mr-2 h-4 w-4" />
              Add Another Document
            </Button>
          </div>
        </motion.div>

        <motion.div className="space-y-2" variants={itemVariants}>
          <Label htmlFor="location" className="text-sm font-medium">
            Your Home Base Location
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="location"
              placeholder="Select your primary location"
              className={`pl-10 ${errors.location ? "border-red-500" : ""} ${
                locationConfirmed ? "pr-10 border-green-500" : ""
              }`}
              value={location}
              readOnly
            />
            {locationConfirmed && (
              <Check className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-green-500" />
            )}
          </div>
          {errors.location && (
            <motion.p className="text-sm text-red-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {errors.location}
            </motion.p>
          )}
          {errors.locationConfirmed && !errors.location && (
            <motion.p className="text-sm text-red-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {errors.locationConfirmed}
            </motion.p>
          )}

          <Button
            type="button"
            variant="outline"
            className="w-full flex items-center justify-center mt-2"
            onClick={() => setShowMap(true)}
          >
            <MapPin className="mr-2 h-4 w-4" />
            {locationConfirmed ? "Change Location" : "Select on Map"}
          </Button>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Button type="submit" className="w-full">
            Complete Sign Up
          </Button>
        </motion.div>
      </motion.form>

      <Modal 
        isOpen={showMap} 
        onClose={() => setShowMap(false)} 
        title="Select Home Base Location"
      >
        <div className="space-y-4">
          <MapSelector 
            height="350px" 
            onConfirmLocation={(selectedLocation) => {
              const formattedLocation = `Lat: ${selectedLocation.lat}, Lng: ${selectedLocation.lng}`;
              setLocation(formattedLocation);
              confirmLocationSelection();
            }} 
          />
        </div>
      </Modal>

      <Modal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        title="Account Created!"
        icon={Check}
        iconClassName="text-green-500"
      >
        <div className="text-center">
          <p className="mb-4">
            Your driver account has been created successfully! We will review your documents and get back to you
            soon.
          </p>
          <Button onClick={() => (window.location.href = "/driver")} className="w-full">
            Go to Dashboard
          </Button>
        </div>
      </Modal>

      <Modal
        isOpen={showVehicleSelector}
        onClose={() => setShowVehicleSelector(false)}
        title="Select Vehicle Type"
      >
        <div className="space-y-4">
          <Input
            placeholder="Search vehicle types..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <div className="space-y-2">
            {filteredVehicleTypes.map((type) => (
              <Button
                key={type.id}
                variant="outline"
                className="w-full"
                onClick={() => selectVehicleType(type.id, type.type)}
              >
                {type.type}
              </Button>
            ))}
          </div>
        </div>
      </Modal>
    </>
  )
}
