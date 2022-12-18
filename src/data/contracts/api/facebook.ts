export interface LoadFacebookUserApi {
  loadUser: (token: LoadFacebookUserApi.Params) => Promise<void>
}

export namespace LoadFacebookUserApi {
  export type Params = {
    token: string
  }

  export type Result = undefined
}
