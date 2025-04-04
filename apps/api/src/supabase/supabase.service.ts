// src/supabase/supabase.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { createClient } from '@supabase/supabase-js';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class SupabaseService {
  private supabase;
  private readonly logger;
  private bucketName;

  constructor(private configService: ConfigService) {
    this.supabase = createClient(this.configService.get<string>('SUPABASE_URL'), this.configService.get<string>('SUPABASE_KEY'));
    this.logger = new Logger(SupabaseService.name);
    this.bucketName = this.configService.get<string>('SUPABASE_BUCKET_NAME');
    this.logger.log('SupabaseService initialized');
    this.logger.debug(`Using bucket: ${this.bucketName}`);
  }

  /**
   * Creates a new user account in Supabase
   * @param email - User's email address
   * @param password - User's password
   * @returns The created user object
   * @throws Error if signup fails
   */
  async createUser(email: string, password: string) {
    this.logger.log(`Creating new user with email: ${email}`);
    this.logger.debug('Attempting user signup');
    const { user, error } = await this.supabase.auth.signUp({ email, password });
    if (error) {
      this.logger.error(`Failed to create user: ${error.message}`);
      throw error;
    }
    this.logger.log(`User created successfully with ID: ${user.id}`);
    return user;
  }

  /**
   * Authenticates a user with email and password
   * @param email - User's email address
   * @param password - User's password
   * @returns The authenticated user object
   * @throws Error if login fails
   */
  async loginUser(email: string, password: string) {
    this.logger.log(`Attempting login for user: ${email}`);
    this.logger.debug('Processing login request');
    const { user, error } = await this.supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      this.logger.error(`Login failed: ${error.message}`);
      throw error;
    }
    this.logger.log(`User logged in successfully: ${user.id}`);
    return user;
  }

  /**
   * Gets the current authentication session
   * @returns The current session object
   */
  async getSession() {
    this.logger.debug('Retrieving current session');
    const session = this.supabase.auth.session();
    this.logger.log(session ? 'Session found' : 'No active session');
    return session;
  }

  /**
   * Uploads a file to Supabase storage
   * @param filePath - Path where file will be stored
   * @param file - File to upload
   * @returns Upload result
   * @throws Error if upload fails
   */
  async uploadFile(filePath: string, file: File) {
    this.logger.log(`Uploading file to path: ${filePath}`);
    this.logger.debug(`File size: ${file.size} bytes`);
    const { data, error } = await this.supabase.storage.from(this.bucketName).upload(filePath, file);

    if (error) {
      this.logger.error(`File upload failed: ${error.message}`);
      throw error;
    }
    this.logger.log('File uploaded successfully');
    return data;
  }

  /**
   * Downloads a file from Supabase storage
   * @param filePath - Path to the file
   * @returns Download URL
   * @throws Error if download fails
   */
  async downloadFile(filePath: string) {
    this.logger.log(`Downloading file from path: ${filePath}`);
    this.logger.debug(`Accessing bucket: ${this.bucketName}`);
    const { data, error } = await this.supabase.storage.from(this.bucketName).download(filePath);

    if (error) {
      this.logger.error(`File download failed: ${error.message}`);
      throw error;
    }
    this.logger.log('File downloaded successfully');
    return data;
  }

  /**
   * Lists all files in a directory
   * @param path - Directory path
   * @returns List of files
   * @throws Error if listing fails
   */
  async listFiles(path: string) {
    this.logger.log(`Listing files in directory: ${path}`);
    this.logger.debug(`Scanning bucket: ${this.bucketName}`);
    const { data, error } = await this.supabase.storage.from(this.bucketName).list(path);

    if (error) {
      this.logger.error(`Failed to list files: ${error.message}`);
      throw error;
    }
    this.logger.log(`Found ${data.length} files`);
    return data;
  }

  /**
   * Deletes a file from storage
   * @param filePath - Path to the file
   * @throws Error if deletion fails
   */
  async deleteFile(filePath: string) {
    this.logger.log(`Deleting file: ${filePath}`);
    this.logger.debug(`Removing from bucket: ${this.bucketName}`);
    const { error } = await this.supabase.storage.from(this.bucketName).remove([filePath]);

    if (error) {
      this.logger.error(`File deletion failed: ${error.message}`);
      throw error;
    }
    this.logger.log('File deleted successfully');
  }

  /**
   * Updates user profile data
   * @param userId - User ID
   * @param data - Profile data to update
   * @returns Updated profile data
   * @throws Error if update fails
   */
  async updateProfile(userId: string, data: any) {
    this.logger.log(`Updating profile for user: ${userId}`);
    this.logger.debug(`Update data: ${JSON.stringify(data)}`);
    const { data: profile, error } = await this.supabase.from('profiles').update(data).eq('id', userId);

    if (error) {
      this.logger.error(`Profile update failed: ${error.message}`);
      throw error;
    }
    this.logger.log('Profile updated successfully');
    return profile;
  }

  /**
   * Retrieves user profile data
   * @param userId - User ID
   * @returns User profile data
   * @throws Error if retrieval fails
   */
  async getProfile(userId: string) {
    this.logger.log(`Retrieving profile for user: ${userId}`);
    this.logger.debug('Querying profiles table');
    const { data: profile, error } = await this.supabase.from('profiles').select('*').eq('id', userId).single();

    if (error) {
      this.logger.error(`Profile retrieval failed: ${error.message}`);
      throw error;
    }
    this.logger.log('Profile retrieved successfully');
    return profile;
  }
}
