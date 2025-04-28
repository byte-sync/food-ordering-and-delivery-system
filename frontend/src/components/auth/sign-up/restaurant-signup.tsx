"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Building, FileText, MapPin, Clock, UtensilsCrossed, Plus, Minus, Check, X, Search, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Modal } from "@/components/auth/modal"
import { MapSelector } from "@/components/ui/map-selector"
import { DocumentUploader } from "@/components/shared/document-uploader"
import { userService, CuisineType, RestaurantType, RestaurantRegistrationData } from "@/services/user-service"

type Day = "monday" | "tuesday" | "wednesday" | "thursday" | "friday" | "saturday" | "sunday"

interface OperatingHours {
  day: Day
  isOpen: boolean
  openTime: string
  closeTime: string
}

// Update the interface to include password
interface RestaurantSignUpProps {
  userData: {
    email: string
    password: string
    firstName: string
    lastName: string
    phone: string
    profileImage: string | null
  }
}

interface SelectedLocation {
  lat: number;
  lng: number;
  address: string;
}

interface MapSelectorProps {
  height?: string;
  onConfirmLocation?: (selectedLocation: { lat: number; lng: number; address: string }) => void;
}

export function RestaurantSignUp({ userData }: RestaurantSignUpProps) {
  // Basic info state
  const [restaurantName, setRestaurantName] = useState("")
  const [licenseNumber, setLicenseNumber] = useState("")
  const [restaurantType, setRestaurantType] = useState("")
  const [cuisineTypes, setCuisineTypes] = useState<string[]>([])
  
  // States for database-fetched data
  const [dbRestaurantTypes, setDbRestaurantTypes] = useState<RestaurantType[]>([])
  const [dbCuisineTypes, setDbCuisineTypes] = useState<CuisineType[]>([])
  const [isLoading, setIsLoading] = useState({
    restaurantTypes: true,
    cuisineTypes: true
  })
  const [loadError, setLoadError] = useState({
    restaurantTypes: '',
    cuisineTypes: ''
  })
  
  // Search states for filtering restaurant and cuisine types
  const [restaurantTypeSearch, setRestaurantTypeSearch] = useState("")
  const [cuisineTypeSearch, setCuisineTypeSearch] = useState("")
  
  // Initial operating hours
  const defaultOperatingHours: OperatingHours[] = [
    { day: "monday", isOpen: true, openTime: "09:00", closeTime: "22:00" },
    { day: "tuesday", isOpen: true, openTime: "09:00", closeTime: "22:00" },
    { day: "wednesday", isOpen: true, openTime: "09:00", closeTime: "22:00" },
    { day: "thursday", isOpen: true, openTime: "09:00", closeTime: "22:00" },
    { day: "friday", isOpen: true, openTime: "09:00", closeTime: "23:00" },
    { day: "saturday", isOpen: true, openTime: "10:00", closeTime: "23:00" },
    { day: "sunday", isOpen: true, openTime: "10:00", closeTime: "22:00" },
  ]
  
  // Document states - manage each document independently
  const [businessLicense, setBusinessLicense] = useState<{ name: string; url: string }>({ name: "Business License", url: "" })
  const [foodSafetyCertificate, setFoodSafetyCertificate] = useState<{ name: string; url: string }>({ name: "Food Safety Certificate", url: "" })
  // Store additional documents in an array
  const [additionalDocuments, setAdditionalDocuments] = useState<{ name: string; url: string }[]>([])
  
  // Operating hours state
  const [operatingHours, setOperatingHours] = useState<OperatingHours[]>(defaultOperatingHours)
  
  // Location state
  const [location, setLocation] = useState("")
  const [locationConfirmed, setLocationConfirmed] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<{lat: number; lng: number} | null>(null)
  
  // UI state
  const [step, setStep] = useState(1)
  const [showRestaurantTypeModal, setShowRestaurantTypeModal] = useState(false)
  const [showCuisineTypesModal, setShowCuisineTypesModal] = useState(false)
  const [showMap, setShowMap] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [isRegistering, setIsRegistering] = useState(false)
  const [registrationError, setRegistrationError] = useState<string | null>(null)

  // Fetch restaurant types and cuisine types from API
  useEffect(() => {
    const fetchRestaurantTypes = async () => {
      try {
        const types = await userService.getRestaurantTypes()
        setDbRestaurantTypes(types)
        setIsLoading(prev => ({ ...prev, restaurantTypes: false }))
      } catch (error) {
        console.error("Failed to fetch restaurant types:", error)
        setLoadError(prev => ({ ...prev, restaurantTypes: 'Failed to load restaurant types' }))
        setIsLoading(prev => ({ ...prev, restaurantTypes: false }))
      }
    }

    const fetchCuisineTypes = async () => {
      try {
        const types = await userService.getCuisineTypes()
        setDbCuisineTypes(types)
        setIsLoading(prev => ({ ...prev, cuisineTypes: false }))
      } catch (error) {
        console.error("Failed to fetch cuisine types:", error)
        setLoadError(prev => ({ ...prev, cuisineTypes: 'Failed to load cuisine types' }))
        setIsLoading(prev => ({ ...prev, cuisineTypes: false }))
      }
    }

    fetchRestaurantTypes()
    fetchCuisineTypes()
  }, [])

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateStep(1)) {
      setStep(2)
    }
  }

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateStep(2)) {
      setStep(3)
    }
  }

  const handleStep3Submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (validateStep(3)) {
      setIsRegistering(true)
      setRegistrationError(null)
      
      try {
        // Find the selected restaurant type ID
        const selectedRestaurantType = dbRestaurantTypes.find(rt => rt.type === restaurantType)
        const restaurantTypeId = selectedRestaurantType?.id || ""
        
        // Find the selected cuisine type IDs
        const selectedCuisineTypeIds = dbCuisineTypes
          .filter(ct => cuisineTypes.includes(ct.name))
          .map(ct => ct.id)
          
        // Format data for registration
        const registrationData: RestaurantRegistrationData = {
          // Common user data
          email: userData.email,
          password: userData.password, // Use the password passed from parent
          firstName: userData.firstName,
          lastName: userData.lastName,
          phone: userData.phone,
          profilePictureUrl: userData.profileImage, // Changed from profileImage to profilePictureUrl
          
          // Restaurant specific data
          restaurantName: restaurantName,
          licenseNumber: licenseNumber,
          restaurantTypeId: restaurantTypeId,
          cuisineTypeIds: selectedCuisineTypeIds,
          operatingHours: operatingHours,
          documents: [businessLicense, foodSafetyCertificate, ...additionalDocuments], 
          location: location,
          locationCoordinates: selectedLocation || undefined
        }

        // Call the registration service
        await userService.register(registrationData, "restaurant")
        
        // Show success modal
        setShowSuccessModal(true)
        
      } catch (error: any) {
        console.error("Registration failed:", error)
        setRegistrationError(error.response?.data?.message || "Registration failed. Please try again.")
      } finally {
        setIsRegistering(false)
      }
    }
  }

  // Action functions
  const handleRestaurantTypeSelect = (type: string) => {
    setRestaurantType(type)
    setShowRestaurantTypeModal(false)
  }
  
  const toggleCuisineType = (type: string) => {
    if (cuisineTypes.includes(type)) {
      setCuisineTypes(cuisineTypes.filter(t => t !== type))
    } else {
      setCuisineTypes([...cuisineTypes, type])
    }
  }
  
  const updateOperatingHours = (index: number, field: keyof OperatingHours, value: any) => {
    const updatedHours = [...operatingHours]
    updatedHours[index] = { ...updatedHours[index], [field]: value }
    setOperatingHours(updatedHours)
  }
  
  const updateDocument = (index: number, documentInfo: { name: string; url: string }) => {
    if (index === 0) {
      setBusinessLicense(documentInfo);
    } else if (index === 1) {
      setFoodSafetyCertificate(documentInfo);
    } else {
      const updatedDocuments = [...additionalDocuments];
      updatedDocuments[index - 2] = documentInfo;
      setAdditionalDocuments(updatedDocuments);
    }
  };
  
  const addDocument = () => {
    setAdditionalDocuments([...additionalDocuments, { name: "Additional Document", url: "" }]);
  };
  
  const confirmLocationSelection = () => {
    setLocationConfirmed(true)
    setShowMap(false)
  }
  
  const toggleModal = (modal: 'restaurantType' | 'cuisineTypes' | 'map' | 'success', isOpen: boolean) => {
    switch (modal) {
      case 'restaurantType':
        setShowRestaurantTypeModal(isOpen)
        break
      case 'cuisineTypes':
        setShowCuisineTypesModal(isOpen)
        break
      case 'map':
        setShowMap(isOpen)
        break
      case 'success':
        setShowSuccessModal(isOpen)
        break
    }
  }
  
  const validateStep = (step: number) => {
    const newErrors: { [key: string]: string } = {}
    let isValid = true
    
    if (step === 1) {
      if (!restaurantName) {
        newErrors.restaurantName = "Restaurant name is required"
        isValid = false
      }
      
      if (!licenseNumber) {
        newErrors.licenseNumber = "License number is required"
        isValid = false
      }
      
      if (!restaurantType) {
        newErrors.restaurantType = "Restaurant type is required"
        isValid = false
      }
      
      if (cuisineTypes.length === 0) {
        newErrors.cuisineTypes = "At least one cuisine type is required"
        isValid = false
      }
    } 
    else if (step === 2) {
      // Operating hours validation if needed
      isValid = true
    }
    else if (step === 3) {
      if (!businessLicense.url || businessLicense.url.trim() === "") {
        newErrors.businessLicense = "Business license document is required";
        isValid = false;
      }
      
      if (!foodSafetyCertificate.url || foodSafetyCertificate.url.trim() === "") {
        newErrors.foodSafetyCertificate = "Food safety certificate is required";
        isValid = false;
      }
      
      const hasInvalidAdditionalDocs = additionalDocuments.some(doc => (!doc.url || doc.url.trim() === ""));
      if (additionalDocuments.length > 0 && hasInvalidAdditionalDocs) {
        newErrors.additionalDocuments = "All additional documents must have files uploaded";
        isValid = false;
      }
      
      if (!location) {
        newErrors.location = "Location is required"
        isValid = false
      }
      
      if (!locationConfirmed) {
        newErrors.locationConfirmed = "Please confirm your location on the map"
        isValid = false
      }
    }
    
    setErrors(newErrors)
    return isValid
  }
  
  const clearErrors = () => {
    setErrors({})
  }
  
  const resetStore = () => {
    // Reset all state values to default
    setRestaurantName("")
    setLicenseNumber("")
    setRestaurantType("")
    setCuisineTypes([])
    setOperatingHours(defaultOperatingHours)
    setBusinessLicense({ name: "Business License", url: "" })
    setFoodSafetyCertificate({ name: "Food Safety Certificate", url: "" })
    setAdditionalDocuments([])
    setLocation("")
    setLocationConfirmed(false)
    setStep(1)
    setShowRestaurantTypeModal(false)
    setShowCuisineTypesModal(false)
    setShowMap(false)
    setShowSuccessModal(false)
    setErrors({})
  }

  const containerVariants = {
    hidden: { opacity: 0, x: 100 },
    visible: {
      opacity: 1, 
      x: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30,
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      x: -100,
      transition: {
        duration: 0.2,
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

  // Fallback options in case API fails
  const fallbackRestaurantTypes = ["Fast Food", "Casual Dining", "Fine Dining", "Cafe", "Bakery", "Food Truck"]
  const fallbackCuisineTypes = [
    "Italian", "Chinese", "Indian", "Mexican", "Japanese", "Thai", 
    "American", "Mediterranean", "French", "Korean", "Vietnamese", "Greek",
  ]

  return (
    <>
      <motion.div key={`step-${step}`} variants={containerVariants} initial="hidden" animate="visible" exit="exit">
        {step === 1 && (
          <motion.form onSubmit={handleStep1Submit} className="space-y-6">
            <motion.div className="space-y-2" variants={itemVariants}>
              <Label htmlFor="restaurantName" className="text-sm font-medium">
                Restaurant Name
              </Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="restaurantName"
                  placeholder="e.g., Tasty Bites"
                  className={`pl-10 ${errors.restaurantName ? "border-red-500" : ""}`}
                  value={restaurantName}
                  onChange={(e) => setRestaurantName(e.target.value)}
                />
              </div>
              {errors.restaurantName && (
                <motion.p className="text-sm text-red-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {errors.restaurantName}
                </motion.p>
              )}
            </motion.div>

            <motion.div className="space-y-2" variants={itemVariants}>
              <Label htmlFor="licenseNumber" className="text-sm font-medium">
                Business License Number
              </Label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="licenseNumber"
                  placeholder="e.g., BL12345678"
                  className={`pl-10 ${errors.licenseNumber ? "border-red-500" : ""}`}
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                />
              </div>
              {errors.licenseNumber && (
                <motion.p className="text-sm text-red-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {errors.licenseNumber}
                </motion.p>
              )}
            </motion.div>

            <motion.div className="space-y-2" variants={itemVariants}>
              <Label className="text-sm font-medium">Restaurant Type</Label>
              <Button
                type="button"
                variant="outline"
                className={`w-full justify-between ${errors.restaurantType ? "border-red-500" : ""}`}
                onClick={() => toggleModal('restaurantType', true)}
              >
                {restaurantType ? restaurantType : "Select Restaurant Type"}
                <UtensilsCrossed className="h-4 w-4 ml-2" />
              </Button>
              {errors.restaurantType && (
                <motion.p className="text-sm text-red-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {errors.restaurantType}
                </motion.p>
              )}
            </motion.div>

            <motion.div className="space-y-2" variants={itemVariants}>
              <Label className="text-sm font-medium">Cuisine Types</Label>
              <div className="flex flex-wrap gap-2 mb-2">
                {cuisineTypes.map((type) => (
                  <div
                    key={type}
                    className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    {type}
                    <button
                      type="button"
                      onClick={() => toggleCuisineType(type)}
                      className="ml-1 p-1 rounded-full hover:bg-primary/20"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
              <Button
                type="button"
                variant="outline"
                className={`w-full ${errors.cuisineTypes ? "border-red-500" : ""}`}
                onClick={() => toggleModal('cuisineTypes', true)}
              >
                Select Cuisine Types
              </Button>
              {errors.cuisineTypes && (
                <motion.p className="text-sm text-red-500" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {errors.cuisineTypes}
                </motion.p>
              )}
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button type="submit" className="w-full">
                Continue
              </Button>
            </motion.div>
          </motion.form>
        )}

        {step === 2 && (
          <motion.form onSubmit={handleStep2Submit} className="space-y-6">
            <motion.div className="space-y-4" variants={itemVariants}>
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Operating Hours</Label>
                <span className="text-xs text-muted-foreground">Click on a day to expand</span>
              </div>

              <div className="space-y-3 border rounded-lg p-4">
                {operatingHours.map((hours, index) => (
                  <motion.div
                    key={hours.day}
                    className="border rounded-lg overflow-hidden"
                    initial={{ height: "auto" }}
                    animate={{ height: "auto" }}
                    transition={{ duration: 0.3 }}
                  >
                    <div
                      className="flex items-center justify-between p-3 bg-gray-50 cursor-pointer"
                      onClick={() => updateOperatingHours(index, "isOpen", !hours.isOpen)}
                    >
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span className="capitalize">{hours.day}</span>
                      </div>
                      <div className="flex items-center">
                        {hours.isOpen ? (
                          <span className="text-sm text-green-600 mr-2">Open</span>
                        ) : (
                          <span className="text-sm text-red-500 mr-2">Closed</span>
                        )}
                        {hours.isOpen ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
                      </div>
                    </div>

                    {hours.isOpen && (
                      <motion.div
                        className="p-3 grid grid-cols-2 gap-3"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <div className="space-y-1">
                          <Label htmlFor={`open-${hours.day}`} className="text-xs">
                            Opening Time
                          </Label>
                          <Input
                            id={`open-${hours.day}`}
                            type="time"
                            value={hours.openTime}
                            onChange={(e) => updateOperatingHours(index, "openTime", e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          <Label htmlFor={`close-${hours.day}`} className="text-xs">
                            Closing Time
                          </Label>
                          <Input
                            id={`close-${hours.day}`}
                            type="time"
                            value={hours.closeTime}
                            onChange={(e) => updateOperatingHours(index, "closeTime", e.target.value)}
                          />
                        </div>
                      </motion.div>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants}>
              <Button type="submit" className="w-full">
                Continue
              </Button>
            </motion.div>
          </motion.form>
        )}

        {step === 3 && (
          <motion.form onSubmit={handleStep3Submit} className="space-y-6">
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
                  key={`document-${businessLicense.name}`}
                  documentName={businessLicense.name}
                  currentDocument={businessLicense}
                  onDocumentUpdate={(documentInfo) => updateDocument(0, documentInfo)}
                  folder="food-ordering-system/restaurant-documents"
                />
                <DocumentUploader
                  key={`document-${foodSafetyCertificate.name}`}
                  documentName={foodSafetyCertificate.name}
                  currentDocument={foodSafetyCertificate}
                  onDocumentUpdate={(documentInfo) => updateDocument(1, documentInfo)}
                  folder="food-ordering-system/restaurant-documents"
                />
                {additionalDocuments.map((doc, index) => (
                  <DocumentUploader
                    key={`document-${doc.name}-${index}`}
                    documentName={doc.name}
                    currentDocument={doc}
                    onDocumentUpdate={(documentInfo) => updateDocument(index + 2, documentInfo)}
                    folder="food-ordering-system/restaurant-documents"
                  />
                ))}

                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={addDocument}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Another Document
                </Button>
              </div>
            </motion.div>

            <motion.div className="space-y-2" variants={itemVariants}>
              <Label htmlFor="location" className="text-sm font-medium">
                Restaurant Location
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="location"
                  placeholder="Search for your restaurant location"
                  className={`pl-10 ${errors.location ? "border-red-500" : ""} ${locationConfirmed ? "pr-10 border-green-500" : ""}`}
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
                className="w-full flex items-center justify-center"
                onClick={() => toggleModal('map', true)}
              >
                <MapPin className="mr-2 h-4 w-4" />
                {locationConfirmed ? "Change Location" : "Select on Map"}
              </Button>
            </motion.div>

            {registrationError && (
              <motion.div 
                className="p-3 border border-red-500 bg-red-50 rounded-md flex items-start"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                <p className="text-sm text-red-700">{registrationError}</p>
              </motion.div>
            )}

            <motion.div variants={itemVariants}>
              <Button 
                type="submit" 
                className="w-full"
                disabled={isRegistering}
              >
                {isRegistering ? "Creating Account..." : "Complete Sign Up"}
              </Button>
            </motion.div>
          </motion.form>
        )}
      </motion.div>

      <Modal
        isOpen={showRestaurantTypeModal}
        onClose={() => toggleModal('restaurantType', false)}
        title="Select Restaurant Type"
      >
        <div className="space-y-3">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search restaurant types..."
              className="pl-10"
              value={restaurantTypeSearch}
              onChange={(e) => setRestaurantTypeSearch(e.target.value)}
            />
          </div>
          {(isLoading.restaurantTypes ? fallbackRestaurantTypes : dbRestaurantTypes.map(type => type.type))
            .filter(type => type.toLowerCase().includes(restaurantTypeSearch.toLowerCase()))
            .map((type, index) => (
              <motion.button
                key={type}
                className="w-full p-3 border rounded-lg flex items-center hover:border-primary hover:bg-primary/5 transition-colors"
                onClick={() => handleRestaurantTypeSelect(type)}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <UtensilsCrossed className="h-5 w-5 mr-3 text-primary" />
                <span>{type}</span>
              </motion.button>
            ))}
        </div>
      </Modal>

      <Modal
        isOpen={showCuisineTypesModal}
        onClose={() => toggleModal('cuisineTypes', false)}
        title="Select Cuisine Types"
      >
        <div className="space-y-3">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search cuisine types..."
              className="pl-10"
              value={cuisineTypeSearch}
              onChange={(e) => setCuisineTypeSearch(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            {(isLoading.cuisineTypes ? fallbackCuisineTypes : dbCuisineTypes.map(type => type.name))
              .filter(type => type.toLowerCase().includes(cuisineTypeSearch.toLowerCase()))
              .map((type, index) => {
                const isSelected = cuisineTypes.includes(type)
                return (
                  <motion.button
                    key={type}
                    className={`p-3 border rounded-lg flex items-center justify-between transition-colors ${
                      isSelected ? "border-primary bg-primary/5" : "hover:border-gray-300"
                    }`}
                    onClick={() => toggleCuisineType(type)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <span>{type}</span>
                    {isSelected && <Check className="h-4 w-4 text-primary" />}
                  </motion.button>
                )
              })}
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Button onClick={() => toggleModal('cuisineTypes', false)} className="w-full">
            Done
          </Button>
        </div>
      </Modal>

      <Modal 
        isOpen={showMap} 
        onClose={() => toggleModal('map', false)} 
        title="Select Restaurant Location"
      >
        <div className="space-y-4">
          <MapSelector 
            height="350px" 
            onConfirmLocation={(selectedLoc: SelectedLocation) => {
              setLocation(selectedLoc.address);
              setSelectedLocation({lat: selectedLoc.lat, lng: selectedLoc.lng});
              setLocationConfirmed(true);
              toggleModal('map', false);
            }} 
          />
        </div>
      </Modal>

      <Modal
        isOpen={showSuccessModal}
        onClose={() => toggleModal('success', false)}
        title="Account Created!"
        icon={Check}
        iconClassName="text-green-500"
      >
        <div className="text-center">
          <p className="mb-4">
            Your restaurant account has been created successfully! We will review your documents and get back to you
            soon.
          </p>
          <Button onClick={() => (window.location.href = "/dashboard")} className="w-full">
            Go to Dashboard
          </Button>
        </div>
      </Modal>
    </>
  )
}
