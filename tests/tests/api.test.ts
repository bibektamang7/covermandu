import axios from 'axios';

// Mock the axios instance for testing
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Test data
const mockUser = {
  id: 'user123',
  email: 'test@example.com',
  name: 'Test User',
  googleId: 'google123',
  image: 'image.jpg',
  role: 'USER'
};

const mockAdmin = {
  id: 'admin123',
  email: 'admin@example.com',
  name: 'Admin User',
  googleId: 'google456',
  image: 'admin.jpg',
  role: 'ADMIN'
};

const mockProduct = {
  id: 'product123',
  name: 'Test Product',
  description: 'Test Description',
  price: 100,
  discount: 10,
  variants: [
    {
      id: 'variant123',
      productId: 'product123',
      color: 'red',
      stock: 5,
      image: 'product.jpg',
      sku: 'SKU123'
    }
  ]
};

const mockCart = {
  id: 'cart123',
  userId: 'user123',
  productVariantId: 'variant123',
  quantity: 2
};

const mockWishlist = {
  id: 'wishlist123',
  userId: 'user123',
  productVariantId: 'variant123'
};

const mockReview = {
  id: 'review123',
  message: 'Great product!',
  stars: 5,
  reviewerId: 'user123',
  productId: 'product123'
};

const userToken = 'user-token';
const adminToken = 'admin-token';

describe('API Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // User Routes
  describe('User Routes', () => {
    describe('POST /api/v1/users/login', () => {
      it('should login user successfully', async () => {
        const loginData = {
          email: 'test@example.com',
          googleId: 'google123'
        };

        mockedAxios.post.mockResolvedValue({
          data: {
            user: mockUser,
            token: userToken
          }
        });

        const response = await axios.post('/api/v1/users/login', loginData);
        
        expect(response.status).toBe(200);
        expect(response.data.user).toEqual(mockUser);
        expect(response.data.token).toBe(userToken);
        expect(mockedAxios.post).toHaveBeenCalledWith('/api/v1/users/login', loginData);
      });

      it('should return 400 for validation error', async () => {
        const invalidLoginData = {
          email: 'invalid-email',
          googleId: ''
        };

        mockedAxios.post.mockRejectedValue({
          response: {
            status: 400,
            data: { message: 'Validation error' }
          }
        });

        await expect(axios.post('/api/v1/users/login', invalidLoginData))
          .rejects
          .toMatchObject({
            response: {
              status: 400,
              data: { message: 'Validation error' }
            }
          });
      });

      it('should return 404 for user not found', async () => {
        const loginData = {
          email: 'nonexistent@example.com',
          googleId: 'nonexistent'
        };

        mockedAxios.post.mockRejectedValue({
          response: {
            status: 404,
            data: { message: 'User not found' }
          }
        });

        await expect(axios.post('/api/v1/users/login', loginData))
          .rejects
          .toMatchObject({
            response: {
              status: 404,
              data: { message: 'User not found' }
            }
          });
      });
    });

    describe('POST /api/v1/users/register', () => {
      it('should register user successfully', async () => {
        const registerData = {
          name: 'New User',
          email: 'new@example.com',
          googleId: 'newgoogle123',
          image: 'newimage.jpg'
        };

        mockedAxios.post.mockResolvedValue({
          data: {
            user: { ...mockUser, ...registerData },
            token: userToken
          }
        });

        const response = await axios.post('/api/v1/users/register', registerData);
        
        expect(response.status).toBe(200);
        expect(response.data.user.name).toBe(registerData.name);
        expect(response.data.token).toBe(userToken);
      });

      it('should return 400 for validation error', async () => {
        const invalidRegisterData = {
          name: '',
          email: 'invalid-email',
          googleId: '',
          image: ''
        };

        mockedAxios.post.mockRejectedValue({
          response: {
            status: 400,
            data: { message: 'Validation error' }
          }
        });

        await expect(axios.post('/api/v1/users/register', invalidRegisterData))
          .rejects
          .toMatchObject({
            response: {
              status: 400,
              data: { message: 'Validation error' }
            }
          });
      });

      it('should return 400 for existing user', async () => {
        const registerData = {
          name: 'Existing User',
          email: 'test@example.com', // Already exists
          googleId: 'google123', // Already exists
          image: 'existing.jpg'
        };

        mockedAxios.post.mockRejectedValue({
          response: {
            status: 400,
            data: { message: 'User already exists' }
          }
        });

        await expect(axios.post('/api/v1/users/register', registerData))
          .rejects
          .toMatchObject({
            response: {
              status: 400,
              data: { message: 'User already exists' }
            }
          });
      });
    });

    describe('GET /api/v1/users/', () => {
      it('should get user info with valid token', async () => {
        mockedAxios.get.mockResolvedValue({
          data: {
            user: mockUser
          }
        });

        const response = await axios.get('/api/v1/users/', {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        });
        
        expect(response.status).toBe(200);
        expect(response.data.user).toEqual(mockUser);
      });

      it('should return 401 without token', async () => {
        mockedAxios.get.mockRejectedValue({
          response: {
            status: 401,
            data: { message: 'Authentication required' }
          }
        });

        await expect(axios.get('/api/v1/users/'))
          .rejects
          .toMatchObject({
            response: {
              status: 401,
              data: { message: 'Authentication required' }
            }
          });
      });

      it('should return 401 with invalid token', async () => {
        mockedAxios.get.mockRejectedValue({
          response: {
            status: 401,
            data: { message: 'Invalid token' }
          }
        });

        await expect(axios.get('/api/v1/users/', {
          headers: {
            Authorization: `Bearer invalid-token`
          }
        }))
          .rejects
          .toMatchObject({
            response: {
              status: 401,
              data: { message: 'Invalid token' }
            }
          });
      });
    });

    describe('GET /api/v1/users/upload', () => {
      it('should get signed URL with valid token', async () => {
        mockedAxios.get.mockResolvedValue({
          data: {
            url: 'https://example.com/upload'
          }
        });

        const response = await axios.get('/api/v1/users/upload', {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        });
        
        expect(response.status).toBe(200);
        expect(response.data.url).toBeDefined();
      });

      it('should return 401 without token', async () => {
        mockedAxios.get.mockRejectedValue({
          response: {
            status: 401,
            data: { message: 'Authentication required' }
          }
        });

        await expect(axios.get('/api/v1/users/upload'))
          .rejects
          .toMatchObject({
            response: {
              status: 401,
              data: { message: 'Authentication required' }
            }
          });
      });
    });
  });

  // Product Routes
  describe('Product Routes', () => {
    describe('GET /api/v1/products/', () => {
      it('should get products successfully', async () => {
        mockedAxios.get.mockResolvedValue({
          data: {
            data: [mockProduct],
            page: 1,
            totalPages: 1,
            total: 1
          }
        });

        const response = await axios.get('/api/v1/products/');
        
        expect(response.status).toBe(200);
        expect(response.data.data).toHaveLength(1);
        expect(response.data.data[0]).toEqual(mockProduct);
      });

      it('should get products with pagination', async () => {
        mockedAxios.get.mockResolvedValue({
          data: {
            data: [],
            page: 2,
            totalPages: 5,
            total: 50
          }
        });

        const response = await axios.get('/api/v1/products/?page=2&limit=10');
        
        expect(response.status).toBe(200);
        expect(response.data.page).toBe(2);
        expect(response.data.totalPages).toBe(5);
      });

      it('should get products with search', async () => {
        mockedAxios.get.mockResolvedValue({
          data: {
            data: [mockProduct],
            page: 1,
            totalPages: 1,
            total: 1
          }
        });

        const response = await axios.get('/api/v1/products/?search=Test');
        
        expect(response.status).toBe(200);
        expect(response.data.data[0].name).toContain('Test');
      });
    });

    describe('GET /api/v1/products/:productId', () => {
      it('should get product by ID successfully', async () => {
        mockedAxios.get.mockResolvedValue({
          data: {
            product: mockProduct,
            isWishlisted: false
          }
        });

        const response = await axios.get(`/api/v1/products/${mockProduct.id}`);
        
        expect(response.status).toBe(200);
        expect(response.data.product).toEqual(mockProduct);
        expect(response.data.isWishlisted).toBe(false);
      });

      it('should return 400 for invalid product ID', async () => {
        mockedAxios.get.mockRejectedValue({
          response: {
            status: 400,
            data: { message: 'Product ID is required' }
          }
        });

        await expect(axios.get('/api/v1/products/'))
          .rejects
          .toMatchObject({
            response: {
              status: 400,
              data: { message: 'Product ID is required' }
            }
          });
      });

      it('should return 404 for non-existent product', async () => {
        mockedAxios.get.mockRejectedValue({
          response: {
            status: 404,
            data: { message: 'Product not found' }
          }
        });

        await expect(axios.get('/api/v1/products/nonexistent'))
          .rejects
          .toMatchObject({
            response: {
              status: 404,
              data: { message: 'Product not found' }
            }
          });
      });
    });

    describe('POST /api/v1/products/', () => {
      it('should create product successfully with admin token', async () => {
        const productData = {
          name: 'New Product',
          description: 'New Description',
          price: 150,
          discount: 5,
          variants: [
            {
              color: 'blue',
              stock: 10,
              image: 'newproduct.jpg'
            }
          ]
        };

        mockedAxios.post.mockResolvedValue({
          data: {
            message: 'Product created successfully'
          }
        });

        const response = await axios.post('/api/v1/products/', productData, {
          headers: {
            Authorization: `Bearer ${adminToken}`
          }
        });
        
        expect(response.status).toBe(200);
        expect(response.data.message).toBe('Product created successfully');
      });

      it('should return 400 for validation error', async () => {
        const invalidProductData = {
          name: '',
          description: '',
          price: -10, // Invalid price
          variants: [] // Empty variants
        };

        mockedAxios.post.mockRejectedValue({
          response: {
            status: 400,
            data: { message: 'Validation error' }
          }
        });

        await expect(axios.post('/api/v1/products/', invalidProductData, {
          headers: {
            Authorization: `Bearer ${adminToken}`
          }
        }))
          .rejects
          .toMatchObject({
            response: {
              status: 400,
              data: { message: 'Validation error' }
            }
          });
      });

      it('should return 403 for non-admin user', async () => {
        const productData = {
          name: 'New Product',
          description: 'New Description',
          price: 150,
          discount: 5,
          variants: [
            {
              color: 'blue',
              stock: 10,
              image: 'newproduct.jpg'
            }
          ]
        };

        mockedAxios.post.mockRejectedValue({
          response: {
            status: 403,
            data: { message: 'Forbidden' }
          }
        });

        await expect(axios.post('/api/v1/products/', productData, {
          headers: {
            Authorization: `Bearer ${userToken}` // User token, not admin
          }
        }))
          .rejects
          .toMatchObject({
            response: {
              status: 403,
              data: { message: 'Forbidden' }
            }
          });
      });

      it('should return 401 without token', async () => {
        const productData = {
          name: 'New Product',
          description: 'New Description',
          price: 150,
          discount: 5,
          variants: [
            {
              color: 'blue',
              stock: 10,
              image: 'newproduct.jpg'
            }
          ]
        };

        mockedAxios.post.mockRejectedValue({
          response: {
            status: 401,
            data: { message: 'Authentication required' }
          }
        });

        await expect(axios.post('/api/v1/products/', productData))
          .rejects
          .toMatchObject({
            response: {
              status: 401,
              data: { message: 'Authentication required' }
            }
          });
      });
    });

    describe('PUT /api/v1/products/:productId', () => {
      it('should update product successfully with admin token', async () => {
        const updateData = {
          name: 'Updated Product',
          description: 'Updated Description'
        };

        mockedAxios.put.mockResolvedValue({
          data: {
            message: 'Product updated successfully'
          }
        });

        const response = await axios.put(`/api/v1/products/${mockProduct.id}`, updateData, {
          headers: {
            Authorization: `Bearer ${adminToken}`
          }
        });
        
        expect(response.status).toBe(200);
        expect(response.data.message).toBe('Product updated successfully');
      });

      it('should return 400 for validation error', async () => {
        mockedAxios.put.mockRejectedValue({
          response: {
            status: 400,
            data: { message: 'Validation error' }
          }
        });

        await expect(axios.put(`/api/v1/products/${mockProduct.id}`, { price: -10 }, {
          headers: {
            Authorization: `Bearer ${adminToken}`
          }
        }))
          .rejects
          .toMatchObject({
            response: {
              status: 400,
              data: { message: 'Validation error' }
            }
          });
      });

      it('should return 403 for non-admin user', async () => {
        const updateData = {
          name: 'Updated Product'
        };

        mockedAxios.put.mockRejectedValue({
          response: {
            status: 403,
            data: { message: 'Forbidden' }
          }
        });

        await expect(axios.put(`/api/v1/products/${mockProduct.id}`, updateData, {
          headers: {
            Authorization: `Bearer ${userToken}` // User token, not admin
          }
        }))
          .rejects
          .toMatchObject({
            response: {
              status: 403,
              data: { message: 'Forbidden' }
            }
          });
      });

      it('should return 401 without token', async () => {
        const updateData = {
          name: 'Updated Product'
        };

        mockedAxios.put.mockRejectedValue({
          response: {
            status: 401,
            data: { message: 'Authentication required' }
          }
        });

        await expect(axios.put(`/api/v1/products/${mockProduct.id}`, updateData))
          .rejects
          .toMatchObject({
            response: {
              status: 401,
              data: { message: 'Authentication required' }
            }
          });
      });

      it('should return 400 for missing product ID', async () => {
        const updateData = {
          name: 'Updated Product'
        };

        mockedAxios.put.mockRejectedValue({
          response: {
            status: 400,
            data: { message: 'Product ID is required' }
          }
        });

        await expect(axios.put('/api/v1/products/', updateData, {
          headers: {
            Authorization: `Bearer ${adminToken}`
          }
        }))
          .rejects
          .toMatchObject({
            response: {
              status: 400,
              data: { message: 'Product ID is required' }
            }
          });
      });
    });

    describe('DELETE /api/v1/products/:productId', () => {
      it('should delete product successfully with admin token', async () => {
        mockedAxios.delete.mockResolvedValue({
          data: {
            message: 'Product deleted'
          }
        });

        const response = await axios.delete(`/api/v1/products/${mockProduct.id}`, {
          headers: {
            Authorization: `Bearer ${adminToken}`
          }
        });
        
        expect(response.status).toBe(200);
        expect(response.data.message).toBe('Product deleted');
      });

      it('should return 403 for non-admin user', async () => {
        mockedAxios.delete.mockRejectedValue({
          response: {
            status: 403,
            data: { message: 'Forbidden' }
          }
        });

        await expect(axios.delete(`/api/v1/products/${mockProduct.id}`, {
          headers: {
            Authorization: `Bearer ${userToken}` // User token, not admin
          }
        }))
          .rejects
          .toMatchObject({
            response: {
              status: 403,
              data: { message: 'Forbidden' }
            }
          });
      });

      it('should return 401 without token', async () => {
        mockedAxios.delete.mockRejectedValue({
          response: {
            status: 401,
            data: { message: 'Authentication required' }
          }
        });

        await expect(axios.delete(`/api/v1/products/${mockProduct.id}`))
          .rejects
          .toMatchObject({
            response: {
              status: 401,
              data: { message: 'Authentication required' }
            }
          });
      });

      it('should return 400 for missing product ID', async () => {
        mockedAxios.delete.mockRejectedValue({
          response: {
            status: 400,
            data: { message: 'Product ID is required' }
          }
        });

        await expect(axios.delete('/api/v1/products/', {
          headers: {
            Authorization: `Bearer ${adminToken}`
          }
        }))
          .rejects
          .toMatchObject({
            response: {
              status: 400,
              data: { message: 'Product ID is required' }
            }
          });
      });
    });
  });

  // Cart Routes
  describe('Cart Routes', () => {
    describe('POST /api/v1/carts/', () => {
      it('should add to cart successfully', async () => {
        const cartData = {
          productVariantId: 'variant123',
          quantity: 2
        };

        mockedAxios.post.mockResolvedValue({
          data: mockCart
        });

        const response = await axios.post('/api/v1/carts/', cartData, {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        });
        
        expect(response.status).toBe(200);
        expect(response.data).toEqual(mockCart);
      });

      it('should return 400 for validation error', async () => {
        const invalidCartData = {
          productVariantId: '', // Required field
          quantity: 0 // Must be at least 1
        };

        mockedAxios.post.mockRejectedValue({
          response: {
            status: 400,
            data: { message: 'Validation error' }
          }
        });

        await expect(axios.post('/api/v1/carts/', invalidCartData, {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        }))
          .rejects
          .toMatchObject({
            response: {
              status: 400,
              data: { message: 'Validation error' }
            }
          });
      });

      it('should return 404 for non-existent product variant', async () => {
        const cartData = {
          productVariantId: 'nonexistent',
          quantity: 1
        };

        mockedAxios.post.mockRejectedValue({
          response: {
            status: 404,
            data: { message: 'Product not found' }
          }
        });

        await expect(axios.post('/api/v1/carts/', cartData, {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        }))
          .rejects
          .toMatchObject({
            response: {
              status: 404,
              data: { message: 'Product not found' }
            }
          });
      });

      it('should return 400 for quantity exceeding stock', async () => {
        const cartData = {
          productVariantId: 'variant123',
          quantity: 10 // Exceeds stock of 5
        };

        mockedAxios.post.mockRejectedValue({
          response: {
            status: 400,
            data: { message: 'Quantity exceeds available stock' }
          }
        });

        await expect(axios.post('/api/v1/carts/', cartData, {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        }))
          .rejects
          .toMatchObject({
            response: {
              status: 400,
              data: { message: 'Quantity exceeds available stock' }
            }
          });
      });

      it('should return 401 without token', async () => {
        const cartData = {
          productVariantId: 'variant123',
          quantity: 2
        };

        mockedAxios.post.mockRejectedValue({
          response: {
            status: 401,
            data: { message: 'Authentication required' }
          }
        });

        await expect(axios.post('/api/v1/carts/', cartData))
          .rejects
          .toMatchObject({
            response: {
              status: 401,
              data: { message: 'Authentication required' }
            }
          });
      });
    });

    describe('GET /api/v1/carts/', () => {
      it('should get cart items successfully', async () => {
        mockedAxios.get.mockResolvedValue({
          data: [mockCart]
        });

        const response = await axios.get('/api/v1/carts/', {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        });
        
        expect(response.status).toBe(200);
        expect(response.data).toHaveLength(1);
        expect(response.data[0]).toEqual(mockCart);
      });

      it('should return 401 without token', async () => {
        mockedAxios.get.mockRejectedValue({
          response: {
            status: 401,
            data: { message: 'Authentication required' }
          }
        });

        await expect(axios.get('/api/v1/carts/'))
          .rejects
          .toMatchObject({
            response: {
              status: 401,
              data: { message: 'Authentication required' }
            }
          });
      });
    });

    describe('PUT /api/v1/carts/:cartId', () => {
      it('should update cart item successfully', async () => {
        const updateData = {
          quantity: 3
        };

        mockedAxios.put.mockResolvedValue({
          data: { ...mockCart, quantity: 3 }
        });

        const response = await axios.put(`/api/v1/carts/${mockCart.id}`, updateData, {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        });
        
        expect(response.status).toBe(200);
        expect(response.data.quantity).toBe(3);
      });

      it('should return 400 for missing cart ID', async () => {
        const updateData = {
          quantity: 3
        };

        mockedAxios.put.mockRejectedValue({
          response: {
            status: 400,
            data: { message: 'Cart ID and quantity are required' }
          }
        });

        await expect(axios.put('/api/v1/carts/', updateData, {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        }))
          .rejects
          .toMatchObject({
            response: {
              status: 400,
              data: { message: 'Cart ID and quantity are required' }
            }
          });
      });

      it('should return 400 for missing quantity', async () => {
        mockedAxios.put.mockRejectedValue({
          response: {
            status: 400,
            data: { message: 'Cart ID and quantity are required' }
          }
        });

        await expect(axios.put(`/api/v1/carts/${mockCart.id}`, {}, {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        }))
          .rejects
          .toMatchObject({
            response: {
              status: 400,
              data: { message: 'Cart ID and quantity are required' }
            }
          });
      });

      it('should return 404 for non-existent cart item', async () => {
        const updateData = {
          quantity: 3
        };

        mockedAxios.put.mockRejectedValue({
          response: {
            status: 404,
            data: { message: 'Cart item not found' }
          }
        });

        await expect(axios.put(`/api/v1/carts/nonexistent`, updateData, {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        }))
          .rejects
          .toMatchObject({
            response: {
              status: 404,
              data: { message: 'Cart item not found' }
            }
          });
      });

      it('should return 400 for quantity exceeding stock', async () => {
        const updateData = {
          quantity: 10 // Exceeds stock of 5
        };

        mockedAxios.put.mockRejectedValue({
          response: {
            status: 400,
            data: { message: 'Quantity exceeds available stock' }
          }
        });

        await expect(axios.put(`/api/v1/carts/${mockCart.id}`, updateData, {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        }))
          .rejects
          .toMatchObject({
            response: {
              status: 400,
              data: { message: 'Quantity exceeds available stock' }
            }
          });
      });

      it('should return 401 without token', async () => {
        const updateData = {
          quantity: 3
        };

        mockedAxios.put.mockRejectedValue({
          response: {
            status: 401,
            data: { message: 'Authentication required' }
          }
        });

        await expect(axios.put(`/api/v1/carts/${mockCart.id}`, updateData))
          .rejects
          .toMatchObject({
            response: {
              status: 401,
              data: { message: 'Authentication required' }
            }
          });
      });
    });

    describe('DELETE /api/v1/carts/:cartId', () => {
      it('should delete cart item successfully', async () => {
        mockedAxios.delete.mockResolvedValue({
          data: { message: 'Cart item deleted' }
        });

        const response = await axios.delete(`/api/v1/carts/${mockCart.id}`, {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        });
        
        expect(response.status).toBe(200);
        expect(response.data.message).toBe('Cart item deleted');
      });

      it('should return 400 for missing cart ID', async () => {
        mockedAxios.delete.mockRejectedValue({
          response: {
            status: 400,
            data: { message: 'Cart ID is required' }
          }
        });

        await expect(axios.delete('/api/v1/carts/', {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        }))
          .rejects
          .toMatchObject({
            response: {
              status: 400,
              data: { message: 'Cart ID is required' }
            }
          });
      });

      it('should return 401 without token', async () => {
        mockedAxios.delete.mockRejectedValue({
          response: {
            status: 401,
            data: { message: 'Authentication required' }
          }
        });

        await expect(axios.delete(`/api/v1/carts/${mockCart.id}`))
          .rejects
          .toMatchObject({
            response: {
              status: 401,
              data: { message: 'Authentication required' }
            }
          });
      });
    });
  });

  // Wishlist Routes
  describe('Wishlist Routes', () => {
    describe('POST /api/v1/wishlists/', () => {
      it('should add to wishlist successfully', async () => {
        const wishlistData = {
          productVariantId: 'variant123'
        };

        mockedAxios.post.mockResolvedValue({
          data: {
            message: 'Product added to wishlist'
          }
        });

        const response = await axios.post('/api/v1/wishlists/', wishlistData, {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        });
        
        expect(response.status).toBe(200);
        expect(response.data.message).toBe('Product added to wishlist');
      });

      it('should return 400 for missing product variant ID', async () => {
        mockedAxios.post.mockRejectedValue({
          response: {
            status: 400,
            data: { message: 'Product ID is required' }
          }
        });

        await expect(axios.post('/api/v1/wishlists/', {}, {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        }))
          .rejects
          .toMatchObject({
            response: {
              status: 400,
              data: { message: 'Product ID is required' }
            }
          });
      });

      it('should return 401 without token', async () => {
        const wishlistData = {
          productVariantId: 'variant123'
        };

        mockedAxios.post.mockRejectedValue({
          response: {
            status: 401,
            data: { message: 'Authentication required' }
          }
        });

        await expect(axios.post('/api/v1/wishlists/', wishlistData))
          .rejects
          .toMatchObject({
            response: {
              status: 401,
              data: { message: 'Authentication required' }
            }
          });
      });
    });

    describe('GET /api/v1/wishlists/', () => {
      it('should get wishlist items successfully', async () => {
        mockedAxios.get.mockResolvedValue({
          data: [mockWishlist]
        });

        const response = await axios.get('/api/v1/wishlists/', {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        });
        
        expect(response.status).toBe(200);
        expect(response.data).toHaveLength(1);
        expect(response.data[0]).toEqual(mockWishlist);
      });

      it('should return 401 without token', async () => {
        mockedAxios.get.mockRejectedValue({
          response: {
            status: 401,
            data: { message: 'Authentication required' }
          }
        });

        await expect(axios.get('/api/v1/wishlists/'))
          .rejects
          .toMatchObject({
            response: {
              status: 401,
              data: { message: 'Authentication required' }
            }
          });
      });
    });

    describe('DELETE /api/v1/wishlists/:id', () => {
      it('should delete wishlist item successfully', async () => {
        mockedAxios.delete.mockResolvedValue({
          data: { message: 'Wishlist item removed' }
        });

        const response = await axios.delete(`/api/v1/wishlists/${mockWishlist.id}`, {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        });
        
        expect(response.status).toBe(200);
        expect(response.data.message).toBe('Wishlist item removed');
      });

      it('should return 400 for missing wishlist item ID', async () => {
        mockedAxios.delete.mockRejectedValue({
          response: {
            status: 400,
            data: { message: 'Wishlist item ID is required' }
          }
        });

        await expect(axios.delete('/api/v1/wishlists/', {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        }))
          .rejects
          .toMatchObject({
            response: {
              status: 400,
              data: { message: 'Wishlist item ID is required' }
            }
          });
      });

      it('should return 401 without token', async () => {
        mockedAxios.delete.mockRejectedValue({
          response: {
            status: 401,
            data: { message: 'Authentication required' }
          }
        });

        await expect(axios.delete(`/api/v1/wishlists/${mockWishlist.id}`))
          .rejects
          .toMatchObject({
            response: {
              status: 401,
              data: { message: 'Authentication required' }
            }
          });
      });
    });
  });

  // Review Routes
  describe('Review Routes', () => {
    describe('POST /api/v1/reviews/', () => {
      it('should create review successfully', async () => {
        const reviewData = {
          message: 'Great product!',
          stars: 5,
          reviewerId: 'user123',
          productId: 'product123'
        };

        mockedAxios.post.mockResolvedValue({
          data: {
            message: 'Review created successfully',
            data: { review: mockReview }
          }
        });

        const response = await axios.post('/api/v1/reviews/', reviewData, {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        });
        
        expect(response.status).toBe(200);
        expect(response.data.message).toBe('Review created successfully');
        expect(response.data.data.review).toEqual(mockReview);
      });

      it('should return 400 for validation error', async () => {
        const invalidReviewData = {
          message: '',
          stars: 10, // Max is 5
          reviewerId: '',
          productId: ''
        };

        mockedAxios.post.mockRejectedValue({
          response: {
            status: 400,
            data: { message: 'Validation error' }
          }
        });

        await expect(axios.post('/api/v1/reviews/', invalidReviewData, {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        }))
          .rejects
          .toMatchObject({
            response: {
              status: 400,
              data: { message: 'Validation error' }
            }
          });
      });

      it('should return 400 for invalid product', async () => {
        const reviewData = {
          message: 'Great product!',
          stars: 5,
          reviewerId: 'user123',
          productId: 'invalid'
        };

        mockedAxios.post.mockRejectedValue({
          response: {
            status: 400,
            data: { message: 'Invalid product' }
          }
        });

        await expect(axios.post('/api/v1/reviews/', reviewData, {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        }))
          .rejects
          .toMatchObject({
            response: {
              status: 400,
              data: { message: 'Invalid product' }
            }
          });
      });

      it('should return 401 without token', async () => {
        const reviewData = {
          message: 'Great product!',
          stars: 5,
          reviewerId: 'user123',
          productId: 'product123'
        };

        mockedAxios.post.mockRejectedValue({
          response: {
            status: 401,
            data: { message: 'Authentication required' }
          }
        });

        await expect(axios.post('/api/v1/reviews/', reviewData))
          .rejects
          .toMatchObject({
            response: {
              status: 401,
              data: { message: 'Authentication required' }
            }
          });
      });
    });

    describe('GET /api/v1/reviews/', () => {
      it('should get user reviews successfully', async () => {
        mockedAxios.get.mockResolvedValue({
          data: {
            data: {
              reviews: [mockReview]
            }
          }
        });

        const response = await axios.get('/api/v1/reviews/', {
          headers: {
            Authorization: `Bearer ${userToken}`
          }
        });
        
        expect(response.status).toBe(200);
        expect(response.data.data.reviews).toHaveLength(1);
        expect(response.data.data.reviews[0]).toEqual(mockReview);
      });

      it('should return 401 without token', async () => {
        mockedAxios.get.mockRejectedValue({
          response: {
            status: 401,
            data: { message: 'Authentication required' }
          }
        });

        await expect(axios.get('/api/v1/reviews/'))
          .rejects
          .toMatchObject({
            response: {
              status: 401,
              data: { message: 'Authentication required' }
            }
          });
      });
    });

    describe('GET /api/v1/reviews/product/:productId', () => {
      it('should get reviews by product successfully', async () => {
        mockedAxios.get.mockResolvedValue({
          data: {
            data: {
              reviews: [mockReview]
            }
          }
        });

        const response = await axios.get(`/api/v1/reviews/product/${mockProduct.id}`);
        
        expect(response.status).toBe(200);
        expect(response.data.data.reviews).toHaveLength(1);
        expect(response.data.data.reviews[0]).toEqual(mockReview);
      });

      it('should get reviews with pagination', async () => {
        mockedAxios.get.mockResolvedValue({
          data: {
            data: {
              reviews: []
            }
          }
        });

        const response = await axios.get(`/api/v1/reviews/product/${mockProduct.id}?page=2&limit=5`);
        
        expect(response.status).toBe(200);
      });

      it('should return 400 for missing product ID', async () => {
        mockedAxios.get.mockRejectedValue({
          response: {
            status: 400,
            data: { message: 'Product ID is required' }
          }
        });

        await expect(axios.get('/api/v1/reviews/product/'))
          .rejects
          .toMatchObject({
            response: {
              status: 400,
              data: { message: 'Product ID is required' }
            }
          });
      });

      it('should return 400 for invalid product ID', async () => {
        mockedAxios.get.mockRejectedValue({
          response: {
            status: 400,
            data: { message: 'Invalid product ID' }
          }
        });

        await expect(axios.get('/api/v1/reviews/product/invalid-id'))
          .rejects
          .toMatchObject({
            response: {
              status: 400,
              data: { message: 'Invalid product ID' }
            }
          });
      });
    });
  });
});