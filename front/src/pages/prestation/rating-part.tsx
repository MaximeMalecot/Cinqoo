import { useEffect, useState } from "react";
import reviewService from "../../services/review.service";
import { displayMsg } from "../../utils/toast";

interface RatingPartProps {
    prestationId: string;
}

interface AverageReview {
    mark: string;
    reviewsCount: number;
}

export default function RatingPart({ prestationId }: RatingPartProps) {
    const [averageMark, setAverageMark] = useState<AverageReview>({
        mark: "0",
        reviewsCount: 0,
    });
    const [reviews, setReviews] = useState<any[]>([]); // TODO: replace any by ReviewItem

    const fetchAverageMark = async () => {
        try {
            const res = await reviewService.getAverageRateOfPrestation(
                prestationId
            );
            console.log(res);
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
            console.log(res);
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

    return (
        <div>
            <div>
                <h3 className="text-xl font-bold">Rating</h3>
                <p className="text-slate-500">
                    Average mark: {averageMark.mark}/5 | Based on{" "}
                    {averageMark.reviewsCount} reviews
                </p>
            </div>
            <p className="text-sm">There is no review for this prestation</p>
        </div>
    );
}
