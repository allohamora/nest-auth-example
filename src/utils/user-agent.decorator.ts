import { Headers } from '@nestjs/common';

export const UserAgent = () => Headers('user-agent');
