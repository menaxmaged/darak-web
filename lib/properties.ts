// Get property by ID
export const getPropertyById = async (id: string | number) => {
  const response = await api.get(`/property/${id}`);
  return response.data.data;
};

// Update property (edit)
export const updateProperty = async (id: string | number, data: any) => {
  // Convert amenities to array if needed
  const payload = {
    ...data,
    amenities: Array.isArray(data.amenities) ? data.amenities : String(data.amenities).split(',').map((a) => a.trim()),
  };
  const response = await api.put(`/property/${id}`, payload);
  return response.data;
};
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api, apiFormData, getErrorMessage } from './api-client';
import { 
  Property,
  PropertiesListResponse,
  PropertyFormData
} from './types';

// Property Management API
export const propertyApi = {
  listProperties: async (params?: {
    page?: string;
    limit?: string;
    search?: string;
    status?: string;
    minPrice?: string;
    maxPrice?: string;
  }) => {
  //   const formData = new FormData();
  //   if (params) {
  //     Object.entries(params).forEach(([key, value]) => {
  //       if (value !== undefined && value !== null && value !== '') {
  //         formData.append(key, value);
  //       }
  //     });
  //   }
    const response = await api.get('/property/list', { params });
    // The backend returns { data: [...] }, so return the array
    return { data: response.data.data, meta: response.data.meta };
  },

  addProperty: async (data: PropertyFormData) => {
    const formData = new FormData();
    
    // Add basic fields
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('location', data.location);
    formData.append('price', data.price.toString());
    formData.append('maxGuests', data.max_guests);
    formData.append('bedrooms', data.bedrooms);
    formData.append('bathrooms', data.bathrooms);
    formData.append('priceUnit', data.price_unit);
    // // Add amenities as JSON string array
   formData.append('amenities', JSON.stringify(data.amenities));
    // // Add images if any 

    if (data.images && data.images.length > 0) {
      console.log(data.images);
      data.images.forEach((image) => {
        console.log(image);
        formData.append(`images`, image);
      });
    }
    console.log(formData);
    
    const response = await apiFormData.post('/property/add', formData);
    return response.data;
  },

  editProperty: async (id: number, data: PropertyFormData) => {
    const formData = new FormData();
    formData.append('property_id', id.toString());
    formData.append('title', data.title);
    formData.append('description', data.description);
    formData.append('location', data.location);
    formData.append('price', data.price.toString());
    formData.append('maxGuests', data.max_guests.toString());
    formData.append('bedrooms', data.bedrooms.toString());
    formData.append('bathrooms', data.bathrooms.toString());
    formData.append('priceUnit', data.price_unit);
    formData.append('amenities', JSON.stringify(data.amenities));
    if (data.images && data.images.length > 0) {
      data.images.forEach((image) => {
        formData.append('images', image);
      });
    }
    const response = await apiFormData.put('/property/edit', formData);
    return response.data;
  },
};

// Property Management Hooks
export const useProperties = (params?: {
    page?: string;
    limit?: string;
    search?: string;
    status?: string;
    minPrice?: string;
    maxPrice?: string;
  }) => {
  return useQuery({
    queryKey: ['properties', params],
    queryFn: () => propertyApi.listProperties(params),
  });
};

export const useAddProperty = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: propertyApi.addProperty,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
    onError: (error) => {
      console.error('Add property error:', getErrorMessage(error));
    },
  });
};

export const useEditProperty = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: PropertyFormData }) => 
      propertyApi.editProperty(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['properties'] });
    },
    onError: (error) => {
      console.error('Edit property error:', getErrorMessage(error));
    },
  });
};
