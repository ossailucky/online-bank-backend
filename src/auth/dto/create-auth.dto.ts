import { IsEmail, IsNotEmpty } from "class-validator";

export class CreateAuthDto {
    @IsEmail()
    @IsNotEmpty({ message: 'Email is required' })
    email: string;

    @IsNotEmpty({ message: 'Password is required' })
    password: string;

    role: string;
}

export class AuthorizeDto {
    @IsNotEmpty()
    id: number;

    @IsEmail()
    @IsNotEmpty({ message: 'Email is required' })
    email: string;
}
