export type TSignupRequest = {
    email: string
    password: string
    name?: string
    login?: string
}

export type TSignupResponse = {
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
