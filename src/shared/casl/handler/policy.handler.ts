import { AppAbility } from '@casl/casl-ability.factory/casl-ability.factory';
import { IPolicyHandler } from '@casl/interface/policy.interface';
import { Actions } from '@shared';

/// --------------------------------------------------- ///
/// ----------------------- USER ---------------------- ///
/// --------------------------------------------------- ///

/**
 * Read User Policy Handler
 */
export class ReadUserPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Actions.Read, 'UserModel');
  }
}

/**
 * Update User Policy Handler
 */
export class UpdateUserPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Actions.Update, 'UserModel');
  }
}

/**
 * Delete User Policy Handler
 */
export class DeleteUserPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Actions.Delete, 'UserModel');
  }
}

/// --------------------------------------------------- ///
/// ---------------------- PRODUCT -------------------- ///
/// --------------------------------------------------- ///

/**
 * Create Product Policy Handler
 */
export class CreateProductPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Actions.Create, 'ProductModel');
  }
}

/**
 * Read Product Policy Handler
 */
export class ReadProductPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Actions.Read, 'ProductModel');
  }
}

/**
 * Update Product Policy Handler
 */
export class UpdateProductPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Actions.Update, 'ProductModel');
  }
}

/**
 * Delete Product Policy Handler
 */
export class DeleteProductPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Actions.Delete, 'ProductModel');
  }
}

/// --------------------------------------------------- ///
/// ----------------------- ADMIN --------------------- ///
/// --------------------------------------------------- ///

/**
 * Read Admin Policy Handler
 */
export class ReadAdminPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Actions.Read, 'AdminModel');
  }
}

/**
 * Update Admin Policy Handler
 */
export class UpdateAdminPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Actions.Update, 'AdminModel');
  }
}

/**
 * Delete Admin Policy Handler
 */
export class DeleteAdminPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Actions.Delete, 'AdminModel');
  }
}

/// --------------------------------------------------- ///
/// ---------------------- VENDOR --------------------- ///
/// --------------------------------------------------- ///

/**
 * Create Vendor Policy Handler
 */
export class ReadVendorPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Actions.Read, 'VendorModel');
  }
}

/**
 * Update Vendor Policy Handler
 */
export class UpdateVendorPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Actions.Update, 'VendorModel');
  }
}

/**
 * Delete Vendor Policy Handler
 */
export class DeleteVendorPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Actions.Delete, 'VendorModel');
  }
}

/// --------------------------------------------------- ///
/// ----------------------- STORE --------------------- ///
/// --------------------------------------------------- ///

/**
 * Create Store Policy Handler
 */
export class CreateStorePolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Actions.Create, 'StoreModel');
  }
}

/**
 * Read Store Policy Handler
 */
export class ReadStorePolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Actions.Read, 'StoreModel');
  }
}

/**
 * Update Store Policy Handler
 */
export class UpdateStorePolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Actions.Update, 'StoreModel');
  }
}

/**
 * Delete Store Policy Handler
 */
export class DeleteStorePolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Actions.Read, 'StoreModel');
  }
}

/// --------------------------------------------------- ///
/// ------------------- STORE CATEGORY ---------------- ///
/// --------------------------------------------------- ///

/**
 * Create Store Category Policy Handler
 */
export class CreateStoreCategoryPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Actions.Create, 'StoreCategoryModel');
  }
}

/**
 * Read Store Category Policy Handler
 */
export class ReadStoreCategoryPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Actions.Read, 'StoreCategoryModel');
  }
}

/**
 * Update Store Category Policy Handler
 */
export class UpdateStoreCategoryPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Actions.Update, 'StoreCategoryModel');
  }
}

/**
 * Delete Store Category Policy Handler
 */
export class DeleteStoreCategoryPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Actions.Delete, 'StoreCategoryModel');
  }
}

/// --------------------------------------------------- ///
/// ------------------- PRODUCT CATEGORY -------------- ///
/// --------------------------------------------------- ///

/**
 * Create Product Category Policy Handler
 */
export class CreateProductCategoryPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Actions.Create, 'ProductCategoryModel');
  }
}

/**
 * Read Product Category Policy Handler
 */
export class ReadProductCategoryPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Actions.Read, 'ProductCategoryModel');
  }
}

/**
 * Update Product Category Policy Handler
 */
export class UpdateProductCategoryPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Actions.Update, 'ProductCategoryModel');
  }
}

/**
 * Delete Product Category Policy Handler
 */
export class DeleteProductCategoryPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Actions.Delete, 'ProductCategoryModel');
  }
}

/// --------------------------------------------------- ///
/// ----------------------- CART ---------------------- ///
/// --------------------------------------------------- ///

/**
 * Create Cart Policy Handler
 */
export class CreateCartPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Actions.Create, 'CartModel');
  }
}

/**
 * Read Cart Policy Handler
 */
export class ReadCartPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Actions.Read, 'CartModel');
  }
}

/**
 * Update Cart Policy Handler
 */
export class UpdateCartPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Actions.Update, 'CartModel');
  }
}

/**
 * Delete Cart Policy Handler
 */
export class DeleteCartPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Actions.Delete, 'CartModel');
  }
}

/// --------------------------------------------------- ///
/// ----------------------- ORDER --------------------- ///
/// --------------------------------------------------- ///

/**
 * Create Order Policy Handler
 */
export class CreateOrderPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Actions.Create, 'OrderModel');
  }
}

/**
 * Read Order Policy Handler
 */
export class ReadOrderPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Actions.Read, 'OrderModel');
  }
}

/**
 * Update Order Policy Handler
 */
export class UpdateOrderPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Actions.Update, 'OrderModel');
  }
}

/**
 * Delete Order Policy Handler
 */
export class DeleteOrderPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Actions.Delete, 'OrderModel');
  }
}

/// --------------------------------------------------- ///
/// --------------------- ORDER ITEM ------------------ ///
/// --------------------------------------------------- ///

/**
 * Create Order Item Policy Handler
 */
export class CreateOrderItemPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Actions.Create, 'OrderItemModel');
  }
}

/**
 * Read Order Item Policy Handler
 */
export class ReadOrderItemPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Actions.Read, 'OrderItemModel');
  }
}

/**
 * Update Order Item Policy Handler
 */
export class UpdateOrderItemPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Actions.Update, 'OrderItemModel');
  }
}

/**
 * Delete Order Item Policy Handler
 */
export class DeleteOrderItemPolicyHandler implements IPolicyHandler {
  handle(ability: AppAbility) {
    return ability.can(Actions.Delete, 'OrderItemModel');
  }
}
