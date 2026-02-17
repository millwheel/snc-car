interface EmailTemplateProps {
    name: string;
}

export function EmailTemplate({ name }: EmailTemplateProps) {
    return (
        <div>
            <h1>Welcome, {name}!</h1>
        </div>
    );
}