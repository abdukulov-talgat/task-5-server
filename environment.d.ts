declare namespace NodeJS {
    export interface ProcessEnv {
        DB_USER: string
        DB_PASSWORD: string
        DB_HOST: string
        DB_NAME: string
        DB_PORT: number
        SERVER_PORT: number
    }
}
