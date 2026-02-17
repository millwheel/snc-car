import { Resend } from 'resend';
import {EmailTemplate} from "@/email/email-template";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST() {
    try {
        const { data, error } = await resend.emails.send({
            from: 'SNC Website <no-reply@dotshef.com>',
            to: ['contact@dotshef.com'],  // TODO 고객사 이메일로 수정 필요
            subject: '문의드립니다.',
            react: EmailTemplate({ name: 'John' }),
        });

        if (error) {
            return Response.json({ error }, { status: 500 });
        }

        return Response.json(data);
    } catch (error) {
        return Response.json({ error }, { status: 500 });
    }
}