interface RatingPartProps {
    prestationId: string;
}

export default function RatingPart({ prestationId }: RatingPartProps) {
    return (
        <div>
            <h3 className="text-xl font-bold">Rating</h3>
            <p className="text-sm">There is no review for this prestation</p>
        </div>
    );
}
