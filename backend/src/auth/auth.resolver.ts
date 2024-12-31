import { Resolver, Mutation, Args, Query, Context } from '@nestjs/graphql'
import { AuthService } from './auth.service'
import { RegisterInput } from './dto/register.input'
import { UseGuards } from '@nestjs/common'
import { AuthGuard } from './auth.guard'
import { User } from 'src/user/entities/user.entity'

@Resolver()
export class AuthResolver {
  constructor(private readonly authService: AuthService) {}

  @Mutation(() => User)
  async register(@Args('input') input: RegisterInput) {
    return this.authService.register(input)
  }

  @Mutation(() => String)
  async login(
    @Args('username') username: string,
    @Args('password') password: string,
  ) {
    const { token } = await this.authService.login(username, password)

    return token
  }

  @UseGuards(AuthGuard)
  @Query(() => User)
  async profile(@Context() ctx: any) {
    const user = ctx.req.user
    return this.authService.validateUser(user.username)
  }
}
