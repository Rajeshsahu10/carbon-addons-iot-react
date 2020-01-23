/**
 * Instead of extending existing carbon-classes we should create new ones when possible.
 * The $iot-prefix is an additional prefix to carbon-classes to show that the class
 * contains iot specific properties. The original prefix from carbon (".bx") is kept.
 * E.g. instead of adding more properties to the carbon class ".bx--btn"
 * we use a new class ".bx--iotbtn" to hold those iot specific properties.
 */
export const IOT_PREFIX = 'iot';
