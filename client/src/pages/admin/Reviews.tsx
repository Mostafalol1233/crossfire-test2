import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Trash2, Star, MessageSquare, Filter } from "lucide-react";

interface Review {
  _id: string;
  productId: string;
  userName: string;
  rating: number;
  comment: string;
  sellerName: string;
  sellerRating: number;
  createdAt: Date;
}

interface Product {
  _id: string;
  title: string;
}

export default function Reviews() {
  const { toast } = useToast();
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<string>("all");

  const { data: reviews, isLoading: reviewsLoading } = useQuery<Review[]>({
    queryKey: ["/api/reviews"],
  });

  const { data: products } = useQuery<Product[]>({
    queryKey: ["/api/products"],
  });

  const deleteReviewMutation = useMutation({
    mutationFn: (id: string) => apiRequest(`/api/reviews/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/reviews"] });
      toast({ title: "Review deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete review", variant: "destructive" });
    },
  });

  const handleDeleteConfirm = () => {
    if (deleteConfirmId) {
      deleteReviewMutation.mutate(deleteConfirmId);
      setDeleteConfirmId(null);
    }
  };

  const getProductName = (productId: string) => {
    const product = products?.find((p) => p._id === productId);
    return product?.title || "Unknown Product";
  };

  const renderStars = (rating: number, testId?: string) => {
    return (
      <div className="flex gap-0.5" data-testid={testId}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "fill-muted text-muted"
            }`}
          />
        ))}
      </div>
    );
  };

  const filteredReviews = reviews?.filter((review) => {
    if (selectedProduct === "all") return true;
    return review.productId === selectedProduct;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <MessageSquare className="h-6 w-6" />
            Reviews Management
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage customer reviews and ratings
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle>All Reviews ({filteredReviews?.length || 0})</CardTitle>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <Select value={selectedProduct} onValueChange={setSelectedProduct}>
                <SelectTrigger className="w-[200px]" data-testid="select-filter-product">
                  <SelectValue placeholder="Filter by product" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Products</SelectItem>
                  {products?.map((product) => (
                    <SelectItem key={product._id} value={product._id}>
                      {product.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {reviewsLoading ? (
            <div className="text-center py-8 text-muted-foreground">
              Loading reviews...
            </div>
          ) : filteredReviews && filteredReviews.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Comment</TableHead>
                  <TableHead>Seller Info</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReviews.map((review) => (
                  <TableRow key={review._id} data-testid={`row-review-${review._id}`}>
                    <TableCell>
                      <div className="font-medium" data-testid={`text-review-product-${review._id}`}>
                        {getProductName(review.productId)}
                      </div>
                    </TableCell>
                    <TableCell data-testid={`text-review-user-${review._id}`}>
                      {review.userName}
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {renderStars(review.rating, `stars-review-rating-${review._id}`)}
                        <div className="text-xs text-muted-foreground">
                          {review.rating}/5
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-md">
                        <p className="text-sm line-clamp-2" data-testid={`text-review-comment-${review._id}`}>
                          {review.comment}
                        </p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm font-medium" data-testid={`text-review-seller-${review._id}`}>
                          {review.sellerName}
                        </div>
                        <div className="flex items-center gap-2">
                          {renderStars(review.sellerRating, `stars-review-seller-rating-${review._id}`)}
                          <span className="text-xs text-muted-foreground">
                            {review.sellerRating}/5
                          </span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm" data-testid={`text-review-date-${review._id}`}>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setDeleteConfirmId(review._id)}
                        data-testid={`button-delete-review-${review._id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {selectedProduct === "all" 
                ? "No reviews found."
                : "No reviews found for this product."}
            </div>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={deleteConfirmId !== null} onOpenChange={() => setDeleteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Review</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this review? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete-review">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} data-testid="button-confirm-delete-review">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
