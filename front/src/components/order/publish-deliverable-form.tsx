interface PublishDeliverableProps {
    publish: (data: any) => void;
}

export default function PublishDeliverable({
    publish,
}: PublishDeliverableProps) {
    return (
        <div>
            <p>publish deliverable</p>
        </div>
    );
}
