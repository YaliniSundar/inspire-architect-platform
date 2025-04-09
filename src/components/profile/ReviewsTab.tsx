
import { useState } from 'react';
import { Star, PlusCircle } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';

interface Review {
  id: string;
  authorName: string;
  authorAvatar: string;
  rating: number;
  date: string;
  comment: string;
  projectTitle?: string;
}

interface ReviewsTabProps {
  reviews?: Review[];
  isArchitect?: boolean;
  profileId?: string;
}

const ReviewsTab = ({ reviews = [], isArchitect = true, profileId }: ReviewsTabProps) => {
  const { user } = useAuth();
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  const form = useForm({
    defaultValues: {
      rating: 5,
      comment: '',
      projectTitle: '',
    }
  });

  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 cursor-pointer ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  const onSubmit = (data: any) => {
    // In a real app, this would make an API call to save the review
    console.log("Review submitted:", data);
    
    toast({
      title: "Review submitted",
      description: "Thank you for your feedback!",
    });
    
    setShowReviewForm(false);
    form.reset();
  };

  // Show request review button only for architects viewing their own profile
  const isOwnArchitectProfile = isArchitect && user?.id === profileId;
  // Show write review button only for homeowners viewing an architect's profile
  const canWriteReview = !isArchitect && user?.userType === 'homeowner';

  return (
    <div className="space-y-8">
      {reviews.length > 0 ? (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-medium">Client Reviews</h2>
            {isOwnArchitectProfile && <Button variant="outline">Request Review</Button>}
            {canWriteReview && (
              <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
                <DialogTrigger asChild>
                  <Button>Write a Review</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>Write a Review</DialogTitle>
                  </DialogHeader>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                      <FormField
                        control={form.control}
                        name="projectTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Project Name</FormLabel>
                            <FormControl>
                              <input 
                                className="w-full px-3 py-2 border rounded-md" 
                                placeholder="What project did they work on?" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="rating"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Rating</FormLabel>
                            <FormControl>
                              <div className="flex gap-1">
                                {Array(5).fill(0).map((_, i) => (
                                  <Star 
                                    key={i} 
                                    className={`h-5 w-5 cursor-pointer ${i < field.value ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                    onClick={() => form.setValue('rating', i + 1)} 
                                  />
                                ))}
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="comment"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Your Review</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Share details about your experience working with this architect" 
                                className="resize-none min-h-[100px]" 
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-end gap-3">
                        <Button type="button" variant="outline" onClick={() => setShowReviewForm(false)}>
                          Cancel
                        </Button>
                        <Button type="submit">
                          Submit Review
                        </Button>
                      </div>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            )}
          </div>
          
          <div className="space-y-6">
            {reviews.map((review) => (
              <div key={review.id} className="bg-background rounded-lg p-6 border">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={review.authorAvatar} 
                      alt={review.authorName}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">{review.authorName}</p>
                      <p className="text-sm text-muted-foreground">{review.date}</p>
                      {review.projectTitle && (
                        <p className="text-sm font-medium mt-1">Project: {review.projectTitle}</p>
                      )}
                    </div>
                  </div>
                  <div className="flex">{renderStars(review.rating)}</div>
                </div>
                <p className="text-muted-foreground">{review.comment}</p>
              </div>
            ))}
          </div>
        </>
      ) : (
        <div className="bg-muted/30 rounded-lg p-6 text-center">
          <h3 className="text-lg font-medium mb-2">No reviews yet</h3>
          <p className="text-muted-foreground">
            {isArchitect 
              ? "This architect hasn't received any reviews yet." 
              : "You haven't left any reviews yet."}
          </p>
          {canWriteReview && (
            <Dialog open={showReviewForm} onOpenChange={setShowReviewForm}>
              <DialogTrigger asChild>
                <Button className="mt-4">Write the First Review</Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                {/* Same form content as above */}
                <DialogHeader>
                  <DialogTitle>Write a Review</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="projectTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Project Name</FormLabel>
                          <FormControl>
                            <input 
                              className="w-full px-3 py-2 border rounded-md" 
                              placeholder="What project did they work on?" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="rating"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rating</FormLabel>
                          <FormControl>
                            <div className="flex gap-1">
                              {Array(5).fill(0).map((_, i) => (
                                <Star 
                                  key={i} 
                                  className={`h-5 w-5 cursor-pointer ${i < field.value ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`}
                                  onClick={() => form.setValue('rating', i + 1)} 
                                />
                              ))}
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="comment"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Your Review</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="Share details about your experience working with this architect" 
                              className="resize-none min-h-[100px]" 
                              {...field} 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end gap-3">
                      <Button type="button" variant="outline" onClick={() => setShowReviewForm(false)}>
                        Cancel
                      </Button>
                      <Button type="submit">
                        Submit Review
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          )}
          {isOwnArchitectProfile && (
            <Button variant="outline" className="mt-4">
              <PlusCircle className="h-4 w-4 mr-2" />
              Request Reviews from Clients
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewsTab;
