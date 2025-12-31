export type TLoginRequest = {
    email: string
    password: string
    name?: string
    login?: string
}

export type TLoginResponse = {
    data: {
        token: string
        email: string
        role: string
        name?: string
        login?: string
        createdAt: string
        updatedAt: string
    }
}
