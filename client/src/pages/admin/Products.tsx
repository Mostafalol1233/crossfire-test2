import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Plus, Trash2, Edit, Package, DollarSign } from "lucide-react";

interface Product {
  _id: string;
  title: string;
  description: string;
  image: string;
  category: string;
  normalPrice: number;
  premiumPrice?: number;
  vipPrice?: number;
  stock: number;
  inStock: boolean;
  seller: string;
  featured: boolean;
  createdAt: Date;
}

export default function Products() {
  const { toast } = useToast();
  const [isCreatingProduct, setIsCreatingProduct] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const [productForm, setProductForm] = useState({
    title: "",
    description: "",
    image: "",
    category: "Weapons",
    normalPrice: 0,
    premiumPrice: 0,
    vipPrice: 0,
    stock: 0,
    inStock: true,
    seller: "CrossFire Store",
    featured: false,
  });

  const { data: products, isLoading } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const createProductMutation = useMutation({
    mutationFn: (data: any) => apiRequest("/api/products", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setIsCreatingProduct(false);
      resetProductForm();
      toast({ title: "Product created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create product", variant: "destructive" });
    },
  });

  const updateProductMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      apiRequest(`/api/products/${id}`, "PATCH", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      setEditingProduct(null);
      setIsCreatingProduct(false);
      resetProductForm();
      toast({ title: "Product updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update product", variant: "destructive" });
    },
  });

  const deleteProductMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/products/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/products"] });
      toast({ title: "Product deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete product", variant: "destructive" });
    },
  });

  const resetProductForm = () => {
    setProductForm({
      title: "",
      description: "",
      image: "",
      category: "Weapons",
      normalPrice: 0,
      premiumPrice: 0,
      vipPrice: 0,
      stock: 0,
      inStock: true,
      seller: "CrossFire Store",
      featured: false,
    });
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setProductForm({
      title: product.title,
      description: product.description,
      image: product.image,
      category: product.category,
      normalPrice: product.normalPrice,
      premiumPrice: product.premiumPrice || 0,
      vipPrice: product.vipPrice || 0,
      stock: product.stock,
      inStock: product.inStock,
      seller: product.seller,
      featured: product.featured,
    });
    setIsCreatingProduct(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const data = {
      ...productForm,
      premiumPrice: productForm.premiumPrice > 0 ? productForm.premiumPrice : undefined,
      vipPrice: productForm.vipPrice > 0 ? productForm.vipPrice : undefined,
    };

    if (editingProduct) {
      updateProductMutation.mutate({ id: editingProduct._id, data });
    } else {
      createProductMutation.mutate(data);
    }
  };

  const handleDeleteConfirm = () => {
    if (deleteConfirmId) {
      deleteProductMutation.mutate(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Package className="h-6 w-6" />
            Products Management
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage products with tiered pricing (Normal, Premium, VIP)
          </p>
        </div>
        <Dialog open={isCreatingProduct} onOpenChange={setIsCreatingProduct}>
          <DialogTrigger asChild>
            <Button onClick={() => {
              setEditingProduct(null);
              resetProductForm();
            }} data-testid="button-create-product">
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle data-testid="dialog-title-product">
                {editingProduct ? "Edit Product" : "Create New Product"}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={productForm.title}
                  onChange={(e) =>
                    setProductForm({ ...productForm, title: e.target.value })
                  }
                  placeholder="Product title"
                  required
                  data-testid="input-product-title"
                />
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={productForm.description}
                  onChange={(e) =>
                    setProductForm({ ...productForm, description: e.target.value })
                  }
                  placeholder="Product description"
                  required
                  rows={3}
                  data-testid="input-product-description"
                />
              </div>

              <div>
                <Label htmlFor="image">Image URL *</Label>
                <Input
                  id="image"
                  value={productForm.image}
                  onChange={(e) =>
                    setProductForm({ ...productForm, image: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                  required
                  data-testid="input-product-image"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={productForm.category}
                    onValueChange={(value) =>
                      setProductForm({ ...productForm, category: value })
                    }
                  >
                    <SelectTrigger id="category" data-testid="select-product-category">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Weapons">Weapons</SelectItem>
                      <SelectItem value="Characters">Characters</SelectItem>
                      <SelectItem value="Equipment">Equipment</SelectItem>
                      <SelectItem value="Consumables">Consumables</SelectItem>
                      <SelectItem value="Special">Special</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="seller">Seller *</Label>
                  <Input
                    id="seller"
                    value={productForm.seller}
                    onChange={(e) =>
                      setProductForm({ ...productForm, seller: e.target.value })
                    }
                    placeholder="Seller name"
                    required
                    data-testid="input-product-seller"
                  />
                </div>
              </div>

              <div className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <Label className="text-base font-semibold">Tiered Pricing</Label>
                </div>
                
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="normalPrice">Normal Price *</Label>
                    <Input
                      id="normalPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      value={productForm.normalPrice}
                      onChange={(e) =>
                        setProductForm({ ...productForm, normalPrice: parseFloat(e.target.value) || 0 })
                      }
                      placeholder="0.00"
                      required
                      data-testid="input-product-normal-price"
                    />
                  </div>

                  <div>
                    <Label htmlFor="premiumPrice">Premium Price</Label>
                    <Input
                      id="premiumPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      value={productForm.premiumPrice}
                      onChange={(e) =>
                        setProductForm({ ...productForm, premiumPrice: parseFloat(e.target.value) || 0 })
                      }
                      placeholder="0.00 (optional)"
                      data-testid="input-product-premium-price"
                    />
                  </div>

                  <div>
                    <Label htmlFor="vipPrice">VIP Price</Label>
                    <Input
                      id="vipPrice"
                      type="number"
                      min="0"
                      step="0.01"
                      value={productForm.vipPrice}
                      onChange={(e) =>
                        setProductForm({ ...productForm, vipPrice: parseFloat(e.target.value) || 0 })
                      }
                      placeholder="0.00 (optional)"
                      data-testid="input-product-vip-price"
                    />
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Leave Premium/VIP prices at 0 if not applicable
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stock">Stock Quantity *</Label>
                  <Input
                    id="stock"
                    type="number"
                    min="0"
                    value={productForm.stock}
                    onChange={(e) =>
                      setProductForm({ ...productForm, stock: parseInt(e.target.value) || 0 })
                    }
                    placeholder="0"
                    required
                    data-testid="input-product-stock"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Status</Label>
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch
                      id="inStock"
                      checked={productForm.inStock}
                      onCheckedChange={(checked) =>
                        setProductForm({ ...productForm, inStock: checked })
                      }
                      data-testid="switch-product-in-stock"
                    />
                    <Label htmlFor="inStock" className="font-normal">
                      In Stock
                    </Label>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="featured"
                  checked={productForm.featured}
                  onCheckedChange={(checked) =>
                    setProductForm({ ...productForm, featured: checked })
                  }
                  data-testid="switch-product-featured"
                />
                <Label htmlFor="featured" className="font-normal">
                  Featured Product
                </Label>
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsCreatingProduct(false);
                    setEditingProduct(null);
                    resetProductForm();
                  }}
                  data-testid="button-cancel-product"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={createProductMutation.isPending || updateProductMutation.isPending}
                  data-testid="button-submit-product"
                >
                  {editingProduct ? "Update" : "Create"} Product
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Products ({products?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading products...
            </div>
          ) : products && products.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Pricing</TableHead>
                  <TableHead>Stock</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product._id} data-testid={`row-product-${product._id}`}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <img
                          src={product.image}
                          alt={product.title}
                          className="w-12 h-12 object-cover rounded"
                        />
                        <div>
                          <div className="font-medium" data-testid={`text-product-title-${product._id}`}>
                            {product.title}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {product.seller}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" data-testid={`badge-product-category-${product._id}`}>
                        {product.category}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm" data-testid={`text-product-normal-price-${product._id}`}>
                          <span className="font-medium">Normal:</span> ${product.normalPrice.toFixed(2)}
                        </div>
                        {product.premiumPrice && product.premiumPrice > 0 && (
                          <div className="text-sm" data-testid={`text-product-premium-price-${product._id}`}>
                            <span className="font-medium">Premium:</span> ${product.premiumPrice.toFixed(2)}
                          </div>
                        )}
                        {product.vipPrice && product.vipPrice > 0 && (
                          <div className="text-sm" data-testid={`text-product-vip-price-${product._id}`}>
                            <span className="font-medium">VIP:</span> ${product.vipPrice.toFixed(2)}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell data-testid={`text-product-stock-${product._id}`}>
                      {product.stock}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <Badge
                          variant={product.inStock ? "default" : "secondary"}
                          data-testid={`badge-product-stock-status-${product._id}`}
                        >
                          {product.inStock ? "In Stock" : "Out of Stock"}
                        </Badge>
                        {product.featured && (
                          <Badge variant="outline" data-testid={`badge-product-featured-${product._id}`}>
                            Featured
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(product)}
                          data-testid={`button-edit-product-${product._id}`}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setDeleteConfirmId(product._id)}
                          data-testid={`button-delete-product-${product._id}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No products found. Create your first product!
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteConfirmId !== null} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete-product">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} data-testid="button-confirm-delete-product">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
