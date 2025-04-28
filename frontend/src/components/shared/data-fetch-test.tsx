"use client"

import { useEffect, useState } from 'react'
import { userService, CuisineType, RestaurantType } from '@/services/user-service'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

// Maximum number of retry attempts
const MAX_RETRIES = 3

export function DataFetchTest() {
  const [cuisineTypes, setCuisineTypes] = useState<CuisineType[]>([])
  const [restaurantTypes, setRestaurantTypes] = useState<RestaurantType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<{message: string, details?: string} | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const fetchWithRetry = async <T,>(
    fetchFn: () => Promise<T>,
    entityName: string,
    maxRetries: number = MAX_RETRIES
  ): Promise<T> => {
    try {
      return await fetchFn()
    } catch (err: any) {
      console.error(`Error fetching ${entityName}:`, err)
      
      if (maxRetries > 0) {
        console.log(`Retrying ${entityName} fetch... (${maxRetries} attempts left)`)
        // Wait a bit before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * (MAX_RETRIES - maxRetries + 1)))
        return fetchWithRetry(fetchFn, entityName, maxRetries - 1)
      }
      
      // Format error message based on error type
      let errorMessage = 'Unknown error occurred'
      let errorDetails = undefined
      
      if (err.message === 'Network Error') {
        errorMessage = `Cannot connect to the ${entityName} service`
        errorDetails = 'The server might be down or unreachable. Please check your network connection or try again later.'
      } else if (err.response) {
        errorMessage = `${entityName} service responded with error: ${err.response.status}`
        errorDetails = err.response.data?.message || `Status code: ${err.response.status}`
      } else if (err.message) {
        errorMessage = err.message
      }
      
      throw { message: errorMessage, details: errorDetails }
    }
  }

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Track individual service errors
      const errors: {[key: string]: {message: string, details?: string}} = {}
      let hasAnyData = false
      
      try {
        // Try to fetch cuisine types with retry logic
        const cuisineData = await fetchWithRetry(
          userService.getCuisineTypes,
          'Cuisine Types'
        )
        console.log('Cuisine Types:', cuisineData)
        setCuisineTypes(cuisineData)
        hasAnyData = true
      } catch (err: any) {
        errors['cuisineTypes'] = err
      }
      
      try {
        // Try to fetch restaurant types with retry logic
        const restaurantData = await fetchWithRetry(
          userService.getRestaurantTypes,
          'Restaurant Types'
        )
        console.log('Restaurant Types:', restaurantData)
        setRestaurantTypes(restaurantData)
        hasAnyData = true
      } catch (err: any) {
        errors['restaurantTypes'] = err
      }
      
      // If we have any errors but also some data, show partial data
      if (Object.keys(errors).length > 0) {
        if (hasAnyData) {
          // Some data loaded, but with errors
          const errorMessages = Object.entries(errors).map(([service, err]) => `${service}: ${err.message}`).join('; ')
          setError({
            message: 'Some data could not be loaded',
            details: errorMessages
          })
        } else {
          // No data loaded at all
          setError({
            message: 'Failed to load data',
            details: Object.values(errors)[0].details || 'Please check the console for more details'
          })
        }
      }
    } catch (err: any) {
      console.error('Error in fetchData:', err)
      setError({
        message: 'Failed to fetch data',
        details: err.message || 'An unexpected error occurred'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleRetry = () => {
    setRetryCount(prev => prev + 1)
    fetchData()
  }

  useEffect(() => {
    fetchData()
  }, []) // Only run once on component mount

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary mr-2" />
        <span>Loading data...</span>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{error.message}</AlertTitle>
          <AlertDescription>
            {error.details}
            <div className="mt-2">
              <Button 
                size="sm" 
                onClick={handleRetry} 
                className="flex items-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Restaurant Types</CardTitle>
          </CardHeader>
          <CardContent>
            {restaurantTypes.length > 0 ? (
              <ul className="space-y-2">
                {restaurantTypes.map((restaurant) => (
                  <li key={restaurant.id} className="p-2 border rounded-md">
                    <p className="font-medium">Type: {restaurant.type}</p>
                    <p className="text-sm text-muted-foreground">Capacity: {restaurant.capacity}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">
                {error?.message.includes('Restaurant Types') 
                  ? 'Failed to load restaurant types.' 
                  : 'No restaurant types found.'}
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Cuisine Types</CardTitle>
          </CardHeader>
          <CardContent>
            {cuisineTypes.length > 0 ? (
              <ul className="space-y-2">
                {cuisineTypes.map((cuisine) => (
                  <li key={cuisine.id} className="p-2 border rounded-md">
                    <p className="font-medium">{cuisine.name}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-muted-foreground">
                {error?.message.includes('Cuisine Types') 
                  ? 'Failed to load cuisine types.' 
                  : 'No cuisine types found.'}
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}