
import { Star } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface Review {
  id: string;
  authorName: string;
  authorAvatar: string;
  rating: number;
  date: string;
  comment: string;
}

interface ReviewsTabProps {
  reviews?: Review[];
  isArchitect?: boolean;
}

const ReviewsTab = ({ reviews = [], isArchitect = true }: ReviewsTabProps) => {
  const renderStars = (rating: number) => {
    return Array(5).fill(0).map((_, i) => (
      <Star 
        key={i} 
        className={`h-4 w-4 ${i < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };

  return (
    <div className="space-y-8">
      {reviews.length > 0 ? (
        <>
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-medium">Client Reviews</h2>
            {isArchitect && <Button variant="outline">Request Review</Button>}
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
          {!isArchitect && (
            <Button className="mt-4">Write a Review</Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ReviewsTab;
