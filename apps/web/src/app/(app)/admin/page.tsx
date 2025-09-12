"use client" 

// import {
//     ImageKitAbortError,
//     ImageKitInvalidRequestError,
//     ImageKitServerError,
//     ImageKitUploadNetworkError,
//     upload,
// } from "@imagekit/next";
// import { useRef, useState } from "react";

// // UploadExample component demonstrates file uploading using ImageKit's Next.js SDK.
// const UploadExample = () => {
//     // State to keep track of the current upload progress (percentage)
//     const [progress, setProgress] = useState(0);

//     // Create a ref for the file input element to access its files easily
//     const fileInputRef = useRef<HTMLInputElement>(null);

//     // Create an AbortController instance to provide an option to cancel the upload if needed.
//     const abortController = new AbortController();

//     /**
//      * Authenticates and retrieves the necessary upload credentials from the server.
//      *
//      * This function calls the authentication API endpoint to receive upload parameters like signature,
//      * expire time, token, and publicKey.
//      *
//      * @returns {Promise<{signature: string, expire: string, token: string, publicKey: string}>} The authentication parameters.
//      * @throws {Error} Throws an error if the authentication request fails.
//      */
//     const authenticator = async () => {
//         try {
//             // Perform the request to the upload authentication endpoint.
//             const response = await fetch("/api/upload-auth");
//             if (!response.ok) {
//                 // If the server response is not successful, extract the error text for debugging.
//                 const errorText = await response.text();
//                 throw new Error(`Request failed with status ${response.status}: ${errorText}`);
//             }

//             // Parse and destructure the response JSON for upload credentials.
//             const data = await response.json();
//             const { signature, expire, token, publicKey } = data;
//             return { signature, expire, token, publicKey };
//         } catch (error) {
//             // Log the original error for debugging before rethrowing a new error.
//             console.error("Authentication error:", error);
//             throw new Error("Authentication request failed");
//         }
//     };

//     /**
//      * Handles the file upload process.
//      *
//      * This function:
//      * - Validates file selection.
//      * - Retrieves upload authentication credentials.
//      * - Initiates the file upload via the ImageKit SDK.
//      * - Updates the upload progress.
//      * - Catches and processes errors accordingly.
//      */
//     const handleUpload = async () => {
//         // Access the file input element using the ref
//         const fileInput = fileInputRef.current;
//         if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
//             alert("Please select a file to upload");
//             return;
//         }

//         // Extract the first file from the file input
//         const file = fileInput.files[0];

//         // Retrieve authentication parameters for the upload.
//         let authParams;
//         try {
//             authParams = await authenticator();
//         } catch (authError) {
//             console.error("Failed to authenticate for upload:", authError);
//             return;
//         }
//         const { signature, expire, token, publicKey } = authParams;

//         // Call the ImageKit SDK upload function with the required parameters and callbacks.
//         try {
//             const uploadResponse = await upload({
//                 // Authentication parameters
//                 expire,
//                 token,
//                 signature,
//                 publicKey,
//                 file,
//                 fileName: file.name, // Optionally set a custom file name
//                 // Progress callback to update upload progress state
//                 onProgress: (event) => {
//                     setProgress((event.loaded / event.total) * 100);
//                 },
//                 // Abort signal to allow cancellation of the upload if needed.
//                 abortSignal: abortController.signal,
//             });
//             console.log("Upload response:", uploadResponse);
//         } catch (error) {
//             // Handle specific error types provided by the ImageKit SDK.
//             if (error instanceof ImageKitAbortError) {
//                 console.error("Upload aborted:", error.reason);
//             } else if (error instanceof ImageKitInvalidRequestError) {
//                 console.error("Invalid request:", error.message);
//             } else if (error instanceof ImageKitUploadNetworkError) {
//                 console.error("Network error:", error.message);
//             } else if (error instanceof ImageKitServerError) {
//                 console.error("Server error:", error.message);
//             } else {
//                 // Handle any other errors that may occur.
//                 console.error("Upload error:", error);
//             }
//         }
//     };

//     return (
//         <>
//             {/* File input element using React ref */}
//             <input type="file" ref={fileInputRef} />
//             {/* Button to trigger the upload process */}
//             <button type="button" onClick={handleUpload}>
//                 Upload file
//             </button>
//             <br />
//             {/* Display the current upload progress */}
//             Upload progress: <progress value={progress} max={100}></progress>
//         </>
//     );
// };

// export default UploadExample;

import { useState } from "react";
import { Footer } from "@/components/Footer";
import  AddProductForm  from "@/components/AddProductForm";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  Users, 
  ShoppingBag, 
  Package, 
  TrendingUp, 
  DollarSign, 
  Eye, 
  Edit, 
  Trash2,
  Plus,
  MoreHorizontal,
  Star,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddProduct, setShowAddProduct] = useState(false);

  const dashboardStats = [
    { title: "Total Revenue", value: "Rs. 2,45,670", change: "+12.5%", icon: DollarSign, color: "text-green-600" },
    { title: "Total Orders", value: "1,247", change: "+8.2%", icon: ShoppingBag, color: "text-blue-600" },
    { title: "Total Products", value: "156", change: "+5.1%", icon: Package, color: "text-purple-600" },
    { title: "Active Users", value: "3,892", change: "+15.3%", icon: Users, color: "text-orange-600" }
  ];

  const products = [
    { id: 1, name: "iPhone 15 Pro Max Case", category: "Cases", price: "Rs. 2,999", stock: 45, status: "Active" },
    { id: 2, name: "MagSafe Wireless Charger", category: "Accessories", price: "Rs. 4,999", stock: 23, status: "Active" },
    { id: 3, name: "Screen Protector", category: "Protection", price: "Rs. 1,299", stock: 0, status: "Out of Stock" },
    { id: 4, name: "Phone Stand", category: "Accessories", price: "Rs. 1,799", stock: 67, status: "Active" },
  ];

  const orders = [
    { id: "#ORD-2024-001", customer: "Rajesh Sharma", date: "2024-01-15", total: "Rs. 3,999", status: "Delivered" },
    { id: "#ORD-2024-002", customer: "Priya Patel", date: "2024-01-14", total: "Rs. 1,299", status: "Shipped" },
    { id: "#ORD-2024-003", customer: "Amit Singh", date: "2024-01-13", total: "Rs. 2,199", status: "Processing" },
    { id: "#ORD-2024-004", customer: "Sita Thapa", date: "2024-01-12", total: "Rs. 4,499", status: "Pending" },
  ];

  const users = [
    { id: 1, name: "Rajesh Sharma", email: "rajesh@example.com", orders: 12, joined: "2023-05-15", status: "Premium" },
    { id: 2, name: "Priya Patel", email: "priya@example.com", orders: 8, joined: "2023-07-20", status: "Regular" },
    { id: 3, name: "Amit Singh", email: "amit@example.com", orders: 15, joined: "2023-03-10", status: "Premium" },
    { id: 4, name: "Sita Thapa", email: "sita@example.com", orders: 3, joined: "2023-12-01", status: "Regular" },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'processing': return 'bg-yellow-100 text-yellow-800';
      case 'pending': return 'bg-orange-100 text-orange-800';
      case 'out of stock': return 'bg-red-100 text-red-800';
      case 'premium': return 'bg-purple-100 text-purple-800';
      case 'regular': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return <CheckCircle className="w-4 h-4" />;
      case 'shipped': return <TrendingUp className="w-4 h-4" />;
      case 'processing': return <Clock className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <main className="pt-20">
        <div className="container mx-auto px-6 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
              <p className="text-muted-foreground">Manage your store and monitor performance</p>
            </div>
            <div className="flex gap-3 mt-4 md:mt-0">
              <Button variant="outline">
                <Eye className="w-4 h-4 mr-2" />
                View Store
              </Button>
              <Button className="btn-hero" onClick={() => setShowAddProduct(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 lg:w-[600px]">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="products">Products</TabsTrigger>
              <TabsTrigger value="orders">Orders</TabsTrigger>
              <TabsTrigger value="users">Users</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {dashboardStats.map((stat, index) => (
                  <Card key={index}>
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                          <stat.icon className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                          <p className="text-2xl font-bold">{stat.value}</p>
                          <p className="text-sm text-muted-foreground">{stat.title}</p>
                          <p className={`text-xs font-medium ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                            {stat.change} from last month
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <div>
                      <CardTitle>Recent Orders</CardTitle>
                      <CardDescription>Latest customer orders</CardDescription>
                    </div>
                    <Button variant="outline" size="sm">View All</Button>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {orders.slice(0, 4).map((order, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div className="flex items-center gap-3">
                            {getStatusIcon(order.status)}
                            <div>
                              <p className="font-medium text-sm">{order.id}</p>
                              <p className="text-xs text-muted-foreground">{order.customer}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-primary">{order.total}</p>
                            <Badge className={getStatusColor(order.status)} variant="secondary">
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Top Selling Products</CardTitle>
                    <CardDescription>Best performing products this month</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {products.slice(0, 4).map((product, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{product.name}</p>
                            <p className="text-xs text-muted-foreground">{product.category}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-primary">{product.price}</p>
                            <p className="text-xs text-muted-foreground">Stock: {product.stock}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="products" className="space-y-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Product Management</CardTitle>
                    <CardDescription>Manage your product catalog</CardDescription>
                  </div>
                  <Button className="btn-hero" onClick={() => setShowAddProduct(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Product
                  </Button>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Product</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.name}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell className="text-primary font-semibold">{product.price}</TableCell>
                          <TableCell>{product.stock}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(product.status)} variant="secondary">
                              {product.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Order Management</CardTitle>
                  <CardDescription>Track and manage customer orders</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Order ID</TableHead>
                        <TableHead>Customer</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Total</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {orders.map((order) => (
                        <TableRow key={order.id}>
                          <TableCell className="font-medium">{order.id}</TableCell>
                          <TableCell>{order.customer}</TableCell>
                          <TableCell>{order.date}</TableCell>
                          <TableCell className="text-primary font-semibold">{order.total}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(order.status)} variant="secondary">
                              {order.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="users" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>Manage registered customers</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Orders</TableHead>
                        <TableHead>Joined</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.name}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.orders}</TableCell>
                          <TableCell>{user.joined}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(user.status)} variant="secondary">
                              {user.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button variant="ghost" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
      
      <AddProductForm 
        open={showAddProduct} 
        onOpenChange={setShowAddProduct} 
      />
    </div>
  );
};

export default AdminDashboard;