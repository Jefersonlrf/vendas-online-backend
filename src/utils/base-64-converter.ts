import { LoginPayload } from "@/auth/dto/loginPayload.dto"

export const authorizationToLoginPayload = (
    authorization: string,
): LoginPayload | undefined => {
    const authorizationSpLited = authorization.split('.');

    if (authorizationSpLited.length < 3 || !authorizationSpLited[1]) {
        return undefined;
    }

    return JSON.parse(Buffer.from(authorizationSpLited[1], 'base64').toString('ascii'));
};