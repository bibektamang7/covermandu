"use client";

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

"use client";
import { useState } from "react";
import AddProductForm from "@/components/AddProductForm";
import EditProductForm from "@/components/EditProductForm";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Eye, Edit, Trash2, Plus } from "lucide-react";

const ProductsManagement = () => {
	const [showAddProduct, setShowAddProduct] = useState(false);
	const [showEditProduct, setShowEditProduct] = useState(false);
	const [editingProduct, setEditingProduct] = useState<any>(null);

	// Mock product data
	const products = [
		{
			id: 1,
			name: "iPhone 15 Pro Max Case",
			category: "Cases",
			price: "Rs. 2,999",
			stock: 45,
			status: "Active",
		},
		{
			id: 2,
			name: "MagSafe Wireless Charger",
			category: "Accessories",
			price: "Rs. 4,999",
			stock: 23,
			status: "Active",
		},
		{
			id: 3,
			name: "Screen Protector",
			category: "Protection",
			price: "Rs. 1,299",
			stock: 0,
			status: "Out of Stock",
		},
		{
			id: 4,
			name: "Phone Stand",
			category: "Accessories",
			price: "Rs. 1,799",
			stock: 67,
			status: "Active",
		},
	];

	const getStatusColor = (status: string) => {
		switch (status.toLowerCase()) {
			case "active":
				return "bg-green-100 text-green-800";
			case "out of stock":
				return "bg-red-100 text-red-800";
			default:
				return "bg-gray-100 text-gray-800";
		}
	};

	const handleEditProduct = (product: any) => {
		setEditingProduct(product);
		setShowEditProduct(true);
	};

	return (
		<div className="space-y-6">
			<Card>
				<CardHeader className="flex flex-row items-center justify-between">
					<div>
						<CardTitle>All Products</CardTitle>
						<CardDescription>
							View and manage your product inventory
						</CardDescription>
					</div>
					<Button onClick={() => setShowAddProduct(true)}>
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
									<TableCell className="text-primary font-semibold">
										{product.price}
									</TableCell>
									<TableCell>{product.stock}</TableCell>
									<TableCell>
										<Badge
											className={getStatusColor(product.status)}
											variant="secondary"
										>
											{product.status}
										</Badge>
									</TableCell>
									<TableCell className="text-right">
										<div className="flex gap-2 justify-end">
											<Button
												variant="ghost"
												size="sm"
											>
												<Eye className="w-4 h-4" />
											</Button>
											<Button
												variant="ghost"
												size="sm"
												onClick={() => handleEditProduct(product)}
											>
												<Edit className="w-4 h-4" />
											</Button>
											<Button
												variant="ghost"
												size="sm"
											>
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

			<AddProductForm
				open={showAddProduct}
				onOpenChange={setShowAddProduct}
			/>

			<EditProductForm
				open={showEditProduct}
				onOpenChange={setShowEditProduct}
				product={editingProduct}
			/>
		</div>
	);
};

export default ProductsManagement;
