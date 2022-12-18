export interface LoadUserAccountRepository {
  load: (
    params: LoadUserAccountRepository.Params
  ) => Promise<LoadUserAccountRepository.Result>
}

export namespace LoadUserAccountRepository {
  export type Params = {
    email: string
  }

  export type Result = undefined
}

export interface CreateUserAccountRepository {
  create: (params: LoadUserAccountRepository.Params) => Promise<void>
}

export namespace CreateUserAccountRepository {
  export type Params = {
    name: string
    email: string
    facebookId: string
  }
}
