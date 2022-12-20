import { AuthenticationError } from '@/domain/errors'
import { FacebookAuthentication } from '@/domain/features'
import { LoadFacebookUserApi } from '@/data/contracts/api'
import {
  CreateFacebookAccountRepository,
  LoadUserAccountRepository,
  UpdateFacebookAccountRepository
} from '@/data/contracts/repos'

export class FacebookAuthenticationService implements FacebookAuthentication {
  constructor (
    private readonly facebookApi: LoadFacebookUserApi,
    private readonly userAccountRepository: LoadUserAccountRepository &
    CreateFacebookAccountRepository &
    UpdateFacebookAccountRepository
  ) {}

  async perform (
    params: FacebookAuthentication.Params
  ): Promise<AuthenticationError> {
    const fbData = await this.facebookApi.loadUser(params)

    if (fbData !== undefined) {
      const accountData = await this.userAccountRepository.load({
        email: fbData.email
      })
      if (accountData?.name !== undefined) {
        await this.userAccountRepository.updateWithFacebook({
          id: accountData.id,
          facebookId: fbData.facebookId,
          name: accountData.name
        })
      } else {
        await this.userAccountRepository.createFromFacebook(fbData)
      }
    }

    return new AuthenticationError()
  }
}
