import { IsString } from "class-validator";

export class updatePasswordDTO {
    @IsString()
    newPassword!: string;
    @IsString()
    lastPassword!: string;
}