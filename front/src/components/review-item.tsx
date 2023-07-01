import { Review } from "../interfaces/review";

interface ReviewItemProps {
    review: Review;
}

export default function ReviewItem({ review }: ReviewItemProps) {
    return (
        <div className="w-full flex flex-col gap-5 p-3 border border-1 border-slate-400 rounded rounded-md">
            <div className="w-full flex gap-3 items-center">
                <label htmlFor="mark" className="text-slate-500">
                    Mark
                </label>
                <div className="rating">
                    {new Array(5).fill(0).map((_, idx) => (
                        <input
                            readOnly
                            key={idx}
                            type="radio"
                            name={`rating-${idx + 1}`}
                            className="mask mask-star"
                            checked={review.mark === idx + 1}
                        />
                    ))}
                </div>
            </div>
            <div className="w-full flex flex-col gap-3">
                <label htmlFor="comment" className="text-slate-500">
                    Comment
                </label>
                <p>{review?.comment ?? "This user has left no comment"}</p>
            </div>
        </div>
    );
}
