// src/messaging/messaging.module.ts
import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: 'EMAIL_SERVICE',
                useFactory: () => ({
                    transport: Transport.RMQ,
                    options: {
                        urls: [process.env.RABBITMQ_URL!],
                        queue: 'email_verification_queue',
                        queueOptions: { durable: true },
                    },
                }),
            },
        ]),
    ],
    exports: [ClientsModule],
})
export class MessagingModule { }