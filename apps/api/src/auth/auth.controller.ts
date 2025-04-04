import { Controller, Post, Body, Get, Logger } from '@nestjs/common';
import { SupabaseService } from '../supabase/supabase.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  private readonly logger;

  constructor(private readonly supabaseService: SupabaseService) {
    this.logger = new Logger(AuthController.name);
  }

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string' },
      },
      required: ['email', 'password'],
    },
  })
  @ApiResponse({ status: 201, description: 'User successfully registered' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async register(@Body() body: { email: string; password: string }) {
    this.logger.log(`Registering user with email: ${body.email}`);
    const user = await this.supabaseService.createUser(body.email, body.password);
    return { user };
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        email: { type: 'string', format: 'email' },
        password: { type: 'string' },
      },
      required: ['email', 'password'],
    },
  })
  @ApiResponse({ status: 200, description: 'User successfully logged in' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async login(@Body() body: { email: string; password: string }) {
    this.logger.log(`Logging in user with email: ${body.email}`);
    const user = await this.supabaseService.loginUser(body.email, body.password);
    return { user };
  }

  @Get('session')
  @ApiOperation({ summary: 'Get current session' })
  @ApiResponse({ status: 200, description: 'Session retrieved successfully' })
  @ApiResponse({ status: 401, description: 'Not authenticated' })
  async getSession() {
    this.logger.log('Getting current session');
    const session = await this.supabaseService.getSession();
    return { session };
  }
}
