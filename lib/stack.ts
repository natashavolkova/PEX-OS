import { StackClientApp } from '@stackframe/stack';

const stack = new StackClientApp({
    projectId: process.env.NEXT_PUBLIC_STACK_PROJECT_ID!,
    tokenStore: 'nextjs-cookie',
});

export default stack;
