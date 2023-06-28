import { useEffect, useState } from "react";
import ReviewItem from "../../components/review-item";
import { useAuthContext } from "../../contexts/auth.context";
import { Review } from "../../interfaces/review";
import reviewService from "../../services/review.service";
import { displayMsg } from "../../utils/toast";
import PublishReview from "./publish-review";

interface RatingPartProps {
    prestationId: string;
}

interface AverageReview {
    mark: string;
    reviewsCount: number;
}

export default function RatingPart({ prestationId }: RatingPartProps) {
    const { isConnected } = useAuthContext();
    const [averageMark, setAverageMark] = useState<AverageReview>({
        mark: "0",
        reviewsCount: 0,
    });
    const [reviews, setReviews] = useState<Review[]>([]);
    const [canPublish, setCanPublish] = useState<boolean>(false);

    const fetchCanPublish = async () => {
        try {
            const res = await reviewService.getCanPublish(prestationId);
            setCanPublish(res.canPublish);
        } catch (e: any) {
            console.log(e.message);
        }
    };

    const fetchAverageMark = async () => {
        try {
            const res = await reviewService.getAverageRateOfPrestation(
                prestationId
            );
            setAverageMark({
                mark: res.averageMark.toFixed(1),
                reviewsCount: res.reviewsCount.toString(),
            });
        } catch (e: any) {
            console.log(e.message);
            displayMsg(e.message, "error");
        }
    };

    const fetchReviews = async () => {
        try {
            const res = await reviewService.getReviewsByPrestation(
                prestationId
            );
            setReviews(res);
        } catch (e: any) {
            console.log(e.message);
            displayMsg(e.message, "error");
        }
    };

    useEffect(() => {
        fetchAverageMark();
        fetchReviews();
    }, [prestationId]);

    useEffect(() => {
        if (isConnected) fetchCanPublish();
    }, [isConnected]);

    return (
        <div className="flex flex-col gap-5">
            <div>
                <h3 className="text-xl font-bold">Rating</h3>
                <p className="text-slate-500">
                    Average mark: {averageMark.mark}/5 | Based on{" "}
                    {averageMark.reviewsCount} reviews
                </p>
            </div>
            {reviews.length === 0 ? (
                <p className="text-sm">
                    There is no review for this prestation
                </p>
            ) : (
                <div className="flex flex-col gap-2">
                    {reviews.map((review, idx) => (
                        <ReviewItem key={idx} review={review} />
                    ))}
                </div>
            )}
            {canPublish && (
                <>
                    <div className="divider my-0" />
                    <PublishReview prestationId={prestationId} />
                </>
            )}
        </div>
    );
}
