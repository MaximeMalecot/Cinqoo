import { useEffect, useState } from "react";
import { Review } from "../../../interfaces/review";
import reviewService from "../../../services/review.service";
import { displayMsg } from "../../../utils/toast";
import ReviewItem from "./review-item";

interface PrestationReviewProps {
    prestationId: string;
}

export default function PrestationReviews({
    prestationId,
}: PrestationReviewProps) {
    const [reviews, setReviews] = useState<Review[]>([]);

    const fetchReviews = async () => {
        try {
            const res = await reviewService.getReviewsByPrestation(
                prestationId
            );
            console.log(res);
            setReviews(res);
        } catch (e: any) {
            console.log(e.message);
            displayMsg(e.message, "error");
        }
    };

    useEffect(() => {
        fetchReviews();
    }, [prestationId]);

    return (
        <div className="w-full">
            <h3 className="text-xl font-bold">Reviews</h3>
            {reviews.length === 0 && (
                <p>There is no review for tihs prestation</p>
            )}
            {
                <div className="flex flex-col w-full">
                    {reviews.map((review, idx) => (
                        <ReviewItem key={idx} review={review} />
                    ))}
                </div>
            }
        </div>
    );
}
