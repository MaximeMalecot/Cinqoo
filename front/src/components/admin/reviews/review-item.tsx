import { Review } from "../../../interfaces/review";

interface ReviewItemProps {
    review: Review;
}

export default function ReviewIten({ review }: ReviewItemProps) {
    return <div>Review item {JSON.stringify(review)}</div>;
}
