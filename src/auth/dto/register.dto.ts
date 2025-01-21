import {
  IsString,
  IsEmail,
  Matches,
  MinLength,
  MaxLength,
  Min,
} from 'class-validator';

export class RegisterDto {
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  firstName: string;

  @IsString()
  @MinLength(3)
  @MaxLength(20)
  lastName: string;

  @IsEmail()
  email: string;

  dob: string;

  @Min(15, { message: 'Age should be greater than 15 years' })
  age: number;

  @IsString()
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  @Matches(/.*[A-Za-z].*/, {
    message: 'Password must contain at least one alphabet',
  })
  @Matches(/.*[0-9].*/, {
    message: 'Password must contain at least one number',
  })
  @Matches(/.*[!@#$%^&*(),.?":{}|<>].*/, {
    message: 'Password must contain at least one special character',
  })
  password: string;
}
