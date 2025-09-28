// API service for connecting frontend to backend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  statusCode?: number;
}

interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
  };
  token: string;
}

interface StaffMember {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
  phone: string;
  location: string;
  joinDate: string;
  bio: string;
  image: string;
  createdAt: string;
  updatedAt: string;
}

interface Product {
  id: string;
  productName: string;
  productId: string;
  description: string;
  email: string;
  status: 'submitted' | 'under-review' | 'approved' | 'in-production' | 'shipped' | 'delivered';
  submissionDate: string;
  lastUpdated: string;
  estimatedDelivery: string;
  progress: number;
  notes: string;
  documentUrl: string;
  createdAt: string;
  updatedAt: string;
}

interface Facility {
  id: string;
  name: string;
  type: string;
  capacity: number;
  availability: 'available' | 'occupied' | 'maintenance';
  description: string;
  amenities: string[];
  location: string;
  pricePerHour: number;
  image: string;
  createdAt: string;
  updatedAt: string;
}

interface FacilityBooking {
  id: string;
  facilityId: string;
  facilityName: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  totalCost: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes: string;
  createdAt: string;
}

interface Document {
  id: string;
  title: string;
  description: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  category: string;
  tags: string[];
  isPublic: boolean;
  uploadedBy: string;
  createdAt: string;
  updatedAt: string;
}

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'read' | 'replied' | 'closed';
  repliedAt: string;
  createdAt: string;
}

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    if (this.token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${this.token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  private async uploadRequest<T>(
    endpoint: string,
    formData: FormData
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    
    const config: RequestInit = {
      method: 'POST',
      body: formData,
    };

    if (this.token) {
      config.headers = {
        Authorization: `Bearer ${this.token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Upload failed');
      }

      return data;
    } catch (error) {
      console.error('Upload request failed:', error);
      throw error;
    }
  }

  // Authentication methods
  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: string;
  }): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<ApiResponse<AuthResponse>> {
    const response = await this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });

    if (response.success && response.data?.token) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async getCurrentUser(): Promise<ApiResponse<{ user: AuthResponse['user'] }>> {
    return this.request<{ user: AuthResponse['user'] }>('/auth/me');
  }

  async updateProfile(profileData: {
    firstName?: string;
    lastName?: string;
    email?: string;
  }): Promise<ApiResponse<{ user: AuthResponse['user'] }>> {
    return this.request<{ user: AuthResponse['user'] }>('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  }

  async changePassword(passwordData: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse> {
    return this.request('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(passwordData),
    });
  }

  logout(): void {
    this.token = null;
    localStorage.removeItem('token');
  }

  setToken(token: string): void {
    this.token = token;
    localStorage.setItem('token', token);
  }

  // Staff methods
  async getStaff(params?: {
    page?: number;
    limit?: number;
    department?: string;
    search?: string;
  }): Promise<ApiResponse<{ staff: StaffMember[]; pagination: any }>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/staff${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<{ staff: StaffMember[]; pagination: any }>(endpoint);
  }

  async getStaffMember(id: string): Promise<ApiResponse<{ staff: StaffMember }>> {
    return this.request<{ staff: StaffMember }>(`/staff/${id}`);
  }

  async createStaff(staffData: FormData): Promise<ApiResponse<{ staff: StaffMember }>> {
    return this.uploadRequest<{ staff: StaffMember }>('/staff', staffData);
  }

  async updateStaff(id: string, staffData: FormData): Promise<ApiResponse<{ staff: StaffMember }>> {
    return this.uploadRequest<{ staff: StaffMember }>(`/staff/${id}`, staffData);
  }

  async deleteStaff(id: string): Promise<ApiResponse> {
    return this.request(`/staff/${id}`, { method: 'DELETE' });
  }

  async getDepartments(): Promise<ApiResponse<{ departments: string[] }>> {
    return this.request<{ departments: string[] }>('/staff/meta/departments');
  }

  // Product methods
  async getProducts(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<ApiResponse<{ products: Product[]; pagination: any }>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/products${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<{ products: Product[]; pagination: any }>(endpoint);
  }

  async getProduct(id: string): Promise<ApiResponse<{ product: Product }>> {
    return this.request<{ product: Product }>(`/products/${id}`);
  }

  async registerProduct(productData: FormData): Promise<ApiResponse<{ product: Product }>> {
    return this.uploadRequest<{ product: Product }>('/products', productData);
  }

  async getProductStatus(id: string): Promise<ApiResponse<{ product: Product }>> {
    return this.request<{ product: Product }>(`/products/${id}/status`);
  }

  async updateProductStatus(
    id: string,
    statusData: {
      status: string;
      progress?: number;
      notes?: string;
      estimatedDelivery?: string;
    }
  ): Promise<ApiResponse<{ product: Product }>> {
    return this.request<{ product: Product }>(`/products/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(statusData),
    });
  }

  async deleteProduct(id: string): Promise<ApiResponse> {
    return this.request(`/products/${id}`, { method: 'DELETE' });
  }

  async getProductStats(): Promise<ApiResponse<{ stats: any }>> {
    return this.request<{ stats: any }>('/products/meta/stats');
  }

  // Facility methods
  async getFacilities(params?: {
    page?: number;
    limit?: number;
    type?: string;
    availability?: string;
    search?: string;
  }): Promise<ApiResponse<{ facilities: Facility[]; pagination: any }>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/facilities${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<{ facilities: Facility[]; pagination: any }>(endpoint);
  }

  async getFacility(id: string): Promise<ApiResponse<{ facility: Facility }>> {
    return this.request<{ facility: Facility }>(`/facilities/${id}`);
  }

  async createFacility(facilityData: FormData): Promise<ApiResponse<{ facility: Facility }>> {
    return this.uploadRequest<{ facility: Facility }>('/facilities', facilityData);
  }

  async updateFacility(id: string, facilityData: FormData): Promise<ApiResponse<{ facility: Facility }>> {
    return this.uploadRequest<{ facility: Facility }>(`/facilities/${id}`, facilityData);
  }

  async updateFacilityAvailability(
    id: string,
    availability: string
  ): Promise<ApiResponse<{ facility: Facility }>> {
    return this.request<{ facility: Facility }>(`/facilities/${id}/availability`, {
      method: 'PUT',
      body: JSON.stringify({ availability }),
    });
  }

  async bookFacility(bookingData: {
    facilityId: string;
    bookingDate: string;
    startTime: string;
    endTime: string;
    notes?: string;
  }): Promise<ApiResponse<{ booking: FacilityBooking }>> {
    return this.request<{ booking: FacilityBooking }>('/facilities/book', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async getMyBookings(params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<ApiResponse<{ bookings: FacilityBooking[]; pagination: any }>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/facilities/bookings/my${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<{ bookings: FacilityBooking[]; pagination: any }>(endpoint);
  }

  async deleteFacility(id: string): Promise<ApiResponse> {
    return this.request(`/facilities/${id}`, { method: 'DELETE' });
  }

  async getFacilityOptions(): Promise<ApiResponse<{ types: string[]; availabilityOptions: string[]; statusOptions: string[] }>> {
    return this.request<{ types: string[]; availabilityOptions: string[]; statusOptions: string[] }>('/facilities/meta/options');
  }

  // Document methods
  async getDocuments(params?: {
    page?: number;
    limit?: number;
    category?: string;
    search?: string;
    tags?: string[];
  }): Promise<ApiResponse<{ documents: Document[]; pagination: any }>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          if (Array.isArray(value)) {
            value.forEach(v => queryParams.append(key, v));
          } else {
            queryParams.append(key, value.toString());
          }
        }
      });
    }
    
    const endpoint = `/documents${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<{ documents: Document[]; pagination: any }>(endpoint);
  }

  async getDocument(id: string): Promise<ApiResponse<{ document: Document }>> {
    return this.request<{ document: Document }>(`/documents/${id}`);
  }

  async uploadDocuments(documentData: FormData): Promise<ApiResponse<{ documents: Document[] }>> {
    return this.uploadRequest<{ documents: Document[] }>('/documents', documentData);
  }

  async updateDocument(
    id: string,
    documentData: {
      title: string;
      description: string;
      category: string;
      tags: string[];
      isPublic: boolean;
    }
  ): Promise<ApiResponse<{ document: Document }>> {
    return this.request<{ document: Document }>(`/documents/${id}`, {
      method: 'PUT',
      body: JSON.stringify(documentData),
    });
  }

  async deleteDocument(id: string): Promise<ApiResponse> {
    return this.request(`/documents/${id}`, { method: 'DELETE' });
  }

  async getDocumentCategories(): Promise<ApiResponse<{ categories: string[] }>> {
    return this.request<{ categories: string[] }>('/documents/meta/categories');
  }

  async getDocumentStats(): Promise<ApiResponse<{ stats: any }>> {
    return this.request<{ stats: any }>('/documents/meta/stats');
  }

  // Contact methods
  async submitContactMessage(messageData: {
    name: string;
    email: string;
    subject: string;
    message: string;
  }): Promise<ApiResponse<{ message: ContactMessage }>> {
    return this.request<{ message: ContactMessage }>('/contact', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  async getContactMessages(params?: {
    page?: number;
    limit?: number;
    status?: string;
    search?: string;
  }): Promise<ApiResponse<{ messages: ContactMessage[]; pagination: any }>> {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
    }
    
    const endpoint = `/contact${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;
    return this.request<{ messages: ContactMessage[]; pagination: any }>(endpoint);
  }

  async getContactMessage(id: string): Promise<ApiResponse<{ message: ContactMessage }>> {
    return this.request<{ message: ContactMessage }>(`/contact/${id}`);
  }

  async updateContactMessageStatus(
    id: string,
    status: string
  ): Promise<ApiResponse<{ message: ContactMessage }>> {
    return this.request<{ message: ContactMessage }>(`/contact/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  async replyToContactMessage(
    id: string,
    replyMessage: string
  ): Promise<ApiResponse> {
    return this.request(`/contact/${id}/reply`, {
      method: 'POST',
      body: JSON.stringify({ replyMessage }),
    });
  }

  async deleteContactMessage(id: string): Promise<ApiResponse> {
    return this.request(`/contact/${id}`, { method: 'DELETE' });
  }

  async getContactStats(): Promise<ApiResponse<{ stats: any }>> {
    return this.request<{ stats: any }>('/contact/meta/stats');
  }

  // Health check
  async healthCheck(): Promise<ApiResponse> {
    return this.request('/health');
  }
}

// Create and export a singleton instance
export const apiService = new ApiService();
export default apiService;

// Export types for use in components
export type {
  ApiResponse,
  AuthResponse,
  StaffMember,
  Product,
  Facility,
  FacilityBooking,
  Document,
  ContactMessage,
};
