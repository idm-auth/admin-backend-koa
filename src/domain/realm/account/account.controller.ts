import { injectable, inject } from 'inversify';
import { AbstractController } from '@/abstract/AbstractController';
import {
  AccountService,
  AccountServiceSymbol,
} from '@/domain/realm/account/account.service';
import { AccountEntity } from '@/domain/realm/account/account.entity';

/**
 * Future AccountController with MagicRouter decorators
 *
 * This is a skeleton showing how AccountController will look when MagicRouter is implemented
 */

export const AccountControllerSymbol = Symbol.for('AccountController');

// @Controller('/accounts')
// @Auth({ someOneMethod: true })
@injectable()
export class AccountController extends AbstractController<
  AccountService,
  { email: string; password: string },
  AccountEntity
> {
  constructor(@inject(AccountServiceSymbol) protected service: AccountService) {
    super();
  }

  protected getResourceType(): string {
    return 'realm.accounts';
  }

  // CRUD methods inherited from AbstractController with default decorators

  // Custom methods specific to Account (commented out for now, focus on CRUD first)

  /*
  // @Get('/email/:email')
  // @Authorize({ operation: 'READ', resource: 'realm.accounts' })
  // @ValidateRequest({ params: tenantIdAndEmailSchema })
  // @ValidateResponse({ 200: accountResponseSchema, 404: errorSchema })
  // @SwaggerDoc({ summary: 'Find account by email', tags: ['Accounts'] })
  async findByEmail(ctx: Context): Promise<void> {
    const { tenantId, email } = ctx.params;
    const result = await this.service.findByEmail(tenantId, email);
    if (!result) {
      ctx.status = 404;
      ctx.body = { error: 'Account not found' };
      return;
    }
    ctx.body = result;
  }

  // @Post('/:id/email')
  // @Authorize({ operation: 'UPDATE', resource: 'realm.accounts' })
  // @ValidateRequest({ params: tenantIdAndIdSchema, body: addEmailSchema })
  // @ValidateResponse({ 200: accountResponseSchema, 400: errorSchema })
  // @SwaggerDoc({ summary: 'Add email to account', tags: ['Accounts'] })
  async addEmail(ctx: Context): Promise<void> {
    const { tenantId, id } = ctx.params;
    const { email } = ctx.request.body;
    const result = await this.service.addEmail(tenantId, id, email);
    ctx.body = result;
  }

  // @Post('/:id/email/remove')
  // @Authorize({ operation: 'UPDATE', resource: 'realm.accounts' })
  // @ValidateRequest({ params: tenantIdAndIdSchema, body: removeEmailSchema })
  // @ValidateResponse({ 200: accountResponseSchema, 400: errorSchema })
  // @SwaggerDoc({ summary: 'Remove email from account', tags: ['Accounts'] })
  async removeEmail(ctx: Context): Promise<void> {
    const { tenantId, id } = ctx.params;
    const { email } = ctx.request.body;
    const result = await this.service.removeEmail(tenantId, id, email);
    ctx.body = result;
  }

  // @Patch('/:id/email/primary')
  // @Authorize({ operation: 'UPDATE', resource: 'realm.accounts' })
  // @ValidateRequest({ params: tenantIdAndIdSchema, body: setPrimaryEmailSchema })
  // @ValidateResponse({ 200: accountResponseSchema, 404: errorSchema })
  // @SwaggerDoc({ summary: 'Set primary email', tags: ['Accounts'] })
  async setPrimaryEmail(ctx: Context): Promise<void> {
    const { tenantId, id } = ctx.params;
    const { email } = ctx.request.body;
    const result = await this.service.setPrimaryEmail(tenantId, id, email);
    ctx.body = result;
  }

  // @Patch('/:id/reset-password')
  // @Authorize({ operation: 'UPDATE', resource: 'realm.accounts' })
  // @ValidateRequest({ params: tenantIdAndIdSchema, body: resetPasswordSchema })
  // @ValidateResponse({ 200: accountResponseSchema, 404: errorSchema })
  // @SwaggerDoc({ summary: 'Reset account password', tags: ['Accounts'] })
  async resetPassword(ctx: Context): Promise<void> {
    const { tenantId, id } = ctx.params;
    const { password } = ctx.request.body;
    const result = await this.service.resetPassword(tenantId, id, password);
    ctx.body = result;
  }

  // @Patch('/:id/update-password')
  // @Authorize({ operation: 'UPDATE', resource: 'realm.accounts' })
  // @ValidateRequest({ params: tenantIdAndIdSchema, body: updatePasswordSchema })
  // @ValidateResponse({ 200: accountResponseSchema, 400: errorSchema, 404: errorSchema })
  // @SwaggerDoc({ summary: 'Update account password', tags: ['Accounts'] })
  async updatePassword(ctx: Context): Promise<void> {
    const { tenantId, id } = ctx.params;
    const { currentPassword, newPassword } = ctx.request.body;
    const result = await this.service.updatePassword(
      tenantId,
      id,
      currentPassword,
      newPassword
    );
    ctx.body = result;
  }

  // @Patch('/:id/active-status')
  // @Authorize({ operation: 'UPDATE', resource: 'realm.accounts' })
  // @ValidateRequest({ params: tenantIdAndIdSchema, body: setActiveStatusSchema })
  // @ValidateResponse({ 200: accountResponseSchema, 404: errorSchema })
  // @SwaggerDoc({ summary: 'Set account active status', tags: ['Accounts'] })
  async setActiveStatus(ctx: Context): Promise<void> {
    const { tenantId, id } = ctx.params;
    const { isActive } = ctx.request.body;
    const result = await this.service.setActiveStatus(tenantId, id, isActive);
    ctx.body = result;
  }
  */
}
