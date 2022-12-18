export interface LoadFacebookUserApi {
  loadUser: (
    token: LoadFacebookUserApi.Params
  ) => Promise<LoadFacebookUserApi.Result>
}

export namespace LoadFacebookUserApi {
  export type Params = {
    token: string
  }

  export type Result =
    | undefined
    | {
      name: string
      email: string
      facebookId: string
    }
}
