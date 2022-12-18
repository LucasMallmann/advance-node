import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { LoadFacebookUserApi } from '@/data/contracts/api'

export class FacebookAuthenticationService implements FacebookAuthentication {
  constructor (private readonly loadFacebookUserApi: LoadFacebookUserApi) {}

  async perform (
    params: FacebookAuthentication.Params
  ): Promise<AuthenticationError> {
    await this.loadFacebookUserApi.loadUser(params)
    return new AuthenticationError()
  }
}