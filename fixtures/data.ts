// The demo store publishes these accounts on its login page; they are not secrets.
export const PASSWORD = "secret_sauce";

export const users = {
  standard: "standard_user",
  lockedOut: "locked_out_user",
} as const;

export const products = {
  backpack: "Sauce Labs Backpack",
  bikeLight: "Sauce Labs Bike Light",
  boltTShirt: "Sauce Labs Bolt T-Shirt",
  onesie: "Sauce Labs Onesie",
} as const;

export const customer = { firstName: "Asha", lastName: "Patil", postalCode: "411001" };

/** The store charges 8% tax, rounded to the cent. */
export const TAX_RATE = 0.08;
