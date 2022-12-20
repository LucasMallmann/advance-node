import { LoadFacebookUserApi } from '@/data/contracts/api'
import {
  CreateFacebookAccountRepository,
  LoadUserAccountRepository,
  UpdateFacebookAccountRepository
} from '@/data/contracts/repos'
import { FacebookAuthenticationService } from '@/data/services/facebook-authentication'
import { AuthenticationError } from '@/domain/errors'

import { mock, MockProxy } from 'jest-mock-extended'

describe('FacebookAuthenticationService', () => {
  let sut: FacebookAuthenticationService
  let facebookApi: MockProxy<LoadFacebookUserApi>
  let userAccountRepository: MockProxy<
  LoadUserAccountRepository &
  CreateFacebookAccountRepository &
  UpdateFacebookAccountRepository
  >

  beforeEach(() => {
    facebookApi = mock()
    facebookApi.loadUser.mockResolvedValue({
      name: 'any_facebok_name',
      email: 'any_facebook_email',
      facebookId: 'any_facebok_id'
    })
    userAccountRepository = mock()
    sut = new FacebookAuthenticationService(facebookApi, userAccountRepository)
  })

  it('should call LoadFacebookUserApi with correct params', async () => {
    await sut.perform({ token: 'any_token' })
    expect(facebookApi.loadUser).toHaveBeenCalledWith({
      token: 'any_token'
    })
    expect(facebookApi.loadUser).toHaveBeenCalledTimes(1)
  })

  it('should return AuthenticationError if LoadFacebookUserApi returns undefined', async () => {
    facebookApi.loadUser.mockResolvedValueOnce(undefined)
    const authResult = await sut.perform({ token: 'any_token' })
    expect(authResult).toEqual(new AuthenticationError())
  })

  it('should call LoadUserRepository if LoadFacebookUserApi returns data', async () => {
    await sut.perform({ token: 'any_token' })
    expect(userAccountRepository.load).toHaveBeenCalledWith({
      email: 'any_facebook_email'
    })
    expect(userAccountRepository.load).toHaveBeenCalledTimes(1)
  })

  it('should call CreateUserAccountRepository when LoadUserAccountRepository returns undefined', async () => {
    userAccountRepository.load.mockResolvedValueOnce(undefined)
    await sut.perform({ token: 'any_token' })
    expect(userAccountRepository.createFromFacebook).toHaveBeenCalledWith({
      name: 'any_facebok_name',
      email: 'any_facebook_email',
      facebookId: 'any_facebok_id'
    })
    expect(userAccountRepository.createFromFacebook).toHaveBeenCalledTimes(1)
  })

  it('should call UpdateUserAccountRepo when LoadUserAccountRepository returns data with name', async () => {
    userAccountRepository.load.mockResolvedValueOnce({
      id: 'any_id',
      name: 'any_name'
    })
    await sut.perform({ token: 'any_token' })
    expect(userAccountRepository.updateWithFacebook).toHaveBeenCalledWith({
      id: 'any_id',
      name: 'any_name',
      facebookId: 'any_facebok_id'
    })
    expect(userAccountRepository.updateWithFacebook).toHaveBeenCalledTimes(1)
  })
})
