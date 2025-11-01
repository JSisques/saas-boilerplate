import { PasswordHashingFailedException } from '@/auth-context/auth/application/exceptions/password-hashing-failed/password-hashing-failed.exception';
import { PasswordVerificationFailedException } from '@/auth-context/auth/application/exceptions/password-verification-failed/password-verification-failed.exception';
import { InvalidHashFormatException } from '@/shared/application/exceptions/password-hashing/invalid-hash-format.exception';
import { InvalidSaltRoundsException } from '@/shared/application/exceptions/password-hashing/invalid-salt-rounds.exception';
import { PasswordValueObject } from '@/shared/domain/value-objects/password.vo';
import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

/**
 * Password Hashing Service Implementation
 * This service handles password hashing and verification using bcrypt
 */
@Injectable()
export class PasswordHashingService {
  private readonly logger = new Logger(PasswordHashingService.name);
  private saltRounds: number;

  constructor() {
    // Use 12 salt rounds for production security
    // Higher rounds = more secure but slower
    this.saltRounds = 12;
  }

  /**
   * Hashes a password using bcrypt
   * @param password - The password value object to hash
   * @returns Promise<string> - The hashed password
   */
  public async hashPassword(password: PasswordValueObject): Promise<string> {
    try {
      const passwordString = password.value;
      const salt = await bcrypt.genSalt(this.saltRounds);
      return await bcrypt.hash(passwordString, salt);
    } catch (error) {
      this.logger.error('Password hashing failed', error);
      throw new PasswordHashingFailedException();
    }
  }

  /**
   * Verifies a password against its hash
   * @param password - The password value object to verify
   * @param hash - The hash to verify against
   * @returns Promise<boolean> - True if password matches hash
   */
  public async verifyPassword(
    password: PasswordValueObject,
    hash: string,
  ): Promise<boolean> {
    try {
      if (!this.isValidHash(hash)) {
        throw new InvalidHashFormatException(hash);
      }

      const passwordString = password.value;
      return await bcrypt.compare(passwordString, hash);
    } catch (error) {
      if (error instanceof InvalidHashFormatException) {
        throw error;
      }
      throw new PasswordVerificationFailedException();
    }
  }

  /**
   * Checks if a string is a valid bcrypt hash format
   * @param hash - The string to check
   * @returns boolean - True if it's a valid hash format
   */
  public isValidHash(hash: string): boolean {
    if (!hash || typeof hash !== 'string') {
      return false;
    }

    // bcrypt hashes start with $2a$, $2b$, $2x$, or $2y$ followed by cost and salt
    const bcryptRegex = /^\$2[abxy]?\$\d{2}\$[./A-Za-z0-9]{53}$/;
    return bcryptRegex.test(hash);
  }

  /**
   * Gets the cost factor used for hashing
   * @returns number - The salt rounds used
   */
  public getCostFactor(): number {
    return this.saltRounds;
  }

  /**
   * Updates the cost factor for new hashes
   * @param rounds - The new number of salt rounds
   */
  public setCostFactor(rounds: number): void {
    if (rounds < 4 || rounds > 31) {
      throw new InvalidSaltRoundsException(rounds);
    }
    this.saltRounds = rounds;
  }
}
