import { AbilityBuilder, PureAbility } from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Actions } from '@shared';
import {
  Admin as AdminModel,
  User as UserModel,
  Product as ProductModel,
  Vendor as VendorModel,
  Store as StoreModel,
  StoreCategory as StoreCategoryModel,
  ProductCategory as ProductCategoryModel,
  Cart as CartModel,
  Order as OrderModel,
  OrderItem as OrderItemModel,
  Role,
} from '@prisma/client';
import { createPrismaAbility, PrismaQuery, Subjects } from '@casl/prisma';

export type AppAbility = PureAbility<
  [
    string,
    (
      | 'all'
      | Subjects<{
        UserModel: UserModel;
        AdminModel: AdminModel;
        ProductModel: ProductModel;
        VendorModel: VendorModel;
        StoreModel: StoreModel;
        StoreCategoryModel: StoreCategoryModel;
        ProductCategoryModel: ProductCategoryModel;
        CartModel: CartModel;
        OrderModel: OrderModel;
        OrderItemModel: OrderItemModel;
      }>
    ),
  ],
  PrismaQuery
>;

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: UserModel | AdminModel) {
    const { can, cannot, build } = new AbilityBuilder<AppAbility>(
      createPrismaAbility,
    );

    if (user.role == Role.USER) {
      /// user can
      can(Actions.Manage, 'UserModel', { id: user.id });
      can(
        Actions.Read,
        [
          'UserModel',
          'ProductModel',
          'VendorModel',
          'StoreModel',
          'StoreCategoryModel',
          'ProductCategoryModel',
        ]
      );
      can(
        Actions.Manage,
        ['CartModel', 'OrderModel'],
        { userId: user.id }
      );
      can(Actions.Manage, 'OrderItemModel', { order: { userId: user.id } })

      /// user cannot
      cannot(
        [Actions.Create, Actions.Update, Actions.Delete,],
        ['ProductModel', 'VendorModel',]
      );
    } else if (user.role == Role.VENDOR) {
      /// vendor can
      can(Actions.Manage, 'VendorModel', { id: user.id });
      can(
        [Actions.Read],
        [
          'UserModel',
          'VendorModel',
          'StoreModel',
          'StoreCategoryModel',
          'ProductCategoryModel',
        ]
      );
      can(Actions.Create, ['StoreModel', 'ProductModel', 'StoreCategoryModel', 'ProductCategoryModel']);
      can(Actions.Manage, 'StoreModel', { vendorId: user.id });
      can(Actions.Manage, ['StoreCategoryModel', 'ProductCategoryModel'])
      can(Actions.Manage, ['ProductModel'], { store: { vendorId: user.id } });

      /// cannot mannage
      cannot(Actions.Manage, ['AdminModel', 'UserModel']);
    } else {
      can(Actions.Manage, 'all');
      can([Actions.Update, Actions.Delete], ['AdminModel'], { id: user.id });
    }

    return build();
  }
}
