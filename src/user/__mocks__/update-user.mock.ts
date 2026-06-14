import { updatePasswordDTO } from "../dtos/update-password.dto";

export const updatePasswordMock: updatePasswordDTO = {
    lastPassword: 'abc',
    newPassword: 'dfgdksjd'
}

export const updatePasswordInvalidMock: updatePasswordDTO = {
    lastPassword: 'abcdajka',
    newPassword: 'dfgdksjd'
}
