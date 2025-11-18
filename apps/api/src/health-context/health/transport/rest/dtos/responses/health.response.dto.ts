import { ApiProperty, ApiResponse } from '@nestjs/swagger';

@ApiResponse({
  status: 200,
  description: 'The health check response',
  type: HealthRestResponseDto,
})
export class HealthRestResponseDto {
  @ApiProperty({
    description: 'The status of the health check',
    example: 'OK',
  })
  status: string;

  @ApiProperty({
    description: 'The status of the write database check',
    example: 'OK',
  })
  writeDatabaseStatus: string;

  @ApiProperty({
    description: 'The status of the read database check',
    example: 'OK',
  })
  readDatabaseStatus: string;
}

@ApiResponse({
  status: 200,
  description: 'The paginated health check response',
  type: PaginatedHealthRestResultDto,
})
export class PaginatedHealthRestResultDto {
  @ApiProperty({
    description: 'The items of the health check',
    example: [{ status: 'OK' }],
  })
  items: HealthRestResponseDto[];
  @ApiProperty({
    description: 'The total number of items',
    example: 100,
  })
  total: number;
  @ApiProperty({
    description: 'The page number',
    example: 1,
  })
  page: number;
  @ApiProperty({
    description: 'The total number of pages',
    example: 10,
  })
  totalPages: number;
}
