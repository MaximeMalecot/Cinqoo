import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation } from "react-router-dom";
import Button from "../../components/button";
import { TextArea } from "../../components/text-area";
import reviewService from "../../services/review.service";
import { displayMsg } from "../../utils/toast";

interface PublishReviewProps {
    prestationId: string;
    scrollToPublishReview?: false;
    onReview: () => void;
}

export default function PublishReview({
    prestationId,
    onReview,
}: PublishReviewProps) {
    const { state } = useLocation();
    const {
        register: registerField,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const [rating, setRating] = useState<number>(1);

    const onSubmit = useCallback(
        async (data: any) => {
            try {
                if (rating < 1) throw new Error("You can minimum put 1 star");
                await reviewService.publish(prestationId, rating, data.comment);
                onReview();
                reset();
            } catch (e: any) {
                console.log(e.message);
                displayMsg(e.message, "error");
            }
        },
        [prestationId, rating]
    );

    useEffect(() => {
        if (state?.scrollToPublishReview) {
            const el = document.getElementById("publish_review");
            if (el) el.scrollIntoView({ behavior: "smooth" });
        }
    }, [state]);

    return (
        <form
            id="publish_review"
            onSubmit={handleSubmit(onSubmit)}
            className="w-full flex flex-col gap-5 p-3 border border-1 border-slate-400 rounded rounded-md"
        >
            <h3 className="text-xl">Publish your own review!</h3>
            <div className="w-full flex gap-3 items-center">
                <label htmlFor="mark">Mark</label>
                <div className="rating">
                    {new Array(5).fill(0).map((_, idx) => (
                        <input
                            onClick={() => setRating(idx + 1)}
                            readOnly
                            key={idx}
                            type="radio"
                            name={`rating-${idx + 1}`}
                            className="mask mask-star"
                            checked={rating === idx + 1}
                        />
                    ))}
                </div>
            </div>
            <div className="w-full flex flex-col gap-3">
                <label htmlFor="comment">Comment</label>
                <TextArea
                    placeholder="How was the order?"
                    register={registerField("comment", { required: false })}
                />
            </div>
            <Button type="submit" className="w-fit ml-auto">
                Publish
            </Button>
        </form>
    );
}
