import { useEffect, useState } from "react";
import { Review } from "../../../interfaces/review";
import reviewService from "../../../services/review.service";
import { displayMsg } from "../../../utils/toast";
import ReviewItem from "./review-item";

interface UserReviewProps {
    userId: string;
}

export default function UserReviews({ userId }: UserReviewProps) {
    const [reviews, setReviews] = useState<Review[]>([]);

    const fetchReviews = async () => {
        try {
            const res = await reviewService.getReviewsByUser(userId);
            console.log(res);
            setReviews(res);
        } catch (e: any) {
            console.log(e.message);
            displayMsg(e.message, "error");
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [userId]);

    return (
        <div>
            <h3 className="text-xl font-bold">Reviews</h3>
            {reviews.length === 0 && <p>This user has never posted a review</p>}
            {reviews.length > 0 &&
                reviews.map((review) => (
                    <ReviewItem key={review._id} review={review} />
                ))}
        </div>
    );
}
