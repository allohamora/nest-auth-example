import { ApiProperty } from '@nestjs/swagger';

export class AccessRefreshTokens {
  @ApiProperty()
  accessToken: string;

  @ApiProperty()
  refreshToken: string;
}
