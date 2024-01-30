import Colors from './Colors';
import Metrics from './Metrics';

const type = {
  base: 'Gotham-Medium',
  bold: 'Gotham-Medium',
  emphasis: 'Gotham-Medium',
  serif: 'Gotham-Medium',
  serifBold: 'Gotham-Medium',
};

const weight = {
  thin: '100',
  ultralight: '200',
  light: '300',
  regular: '400',
  medium: '500',
  semibold: '600',
  bold: '700',
  heavy: '800',
  black: '900',
};

const size = {
  h1: 38,
  h2: 34,
  h3: 30,
  h4: 26,
  h5: 20,
  h6: 19,
  input: 18,
  regular: 15,
  medium: 14,
  small: 12,
  tiny: 8.5,

  pt60: 30,
  pt58: 29,
  pt56: 28,
  pt54: 27,
  pt52: 26,
  pt50: 25,
  pt48: 24,
  pt46: 23,
  pt44: 22,
  pt42: 21,
  pt40: 20,
  pt38: 19,
  pt36: 18,
  pt34: 17,
  pt32: 16,
  pt30: 15,
  pt28: 14,
  pt26: 13,
};

const style: any = {
  h1: {
    fontFamily: type.base,
    fontSize: size.h1,
  },
  h2: {
    fontWeight: weight.bold,
    fontSize: size.h2,
  },
  h3: {
    fontFamily: type.emphasis,
    fontSize: size.h3,
  },
  h4: {
    fontFamily: type.base,
    fontSize: size.h4,
  },
  menuItem: {
    fontFamily: type.bold,
    fontSize: size.h5,
  },
  menuItemIndent: {
    fontFamily: type.base,
    fontSize: size.h6,
  },
  menuItemIndentBold: {
    fontFamily: type.bold,
    fontSize: size.h6,
  },
  h5: {
    fontFamily: type.base,
    fontSize: size.h5,
  },

  title: {
    fontFamily: type.base,
    fontWeight: weight.bold,
    fontSize: 36,
    lineHeight: 40,
    textAlign: 'center',
    margin: 40,
  },
  subtitle: {
    marginTop: Metrics.doubleBaseMargin,
    fontFamily: type.base,
    fontSize: 20,
    lineHeight: 26,
    fontWeight: weight.ultralight,
    textAlign: 'left',
  },
  topnav: {
    fontFamily: type.base,
    fontSize: 30,
    fontWeight: weight.bold,
  },

  sectionHeader: {
    // marginTop: Metrics.doubleBaseMargin,
    fontFamily: type.base,
    fontWeight: weight.bold,
    fontSize: 20,
    lineHeight: 21,
    textAlign: 'left',
  },
  h6: {
    fontFamily: type.emphasis,
    fontSize: size.h6,
  },
  normal: {
    fontFamily: type.base,
    fontSize: size.regular,
    fontWeight: weight.regular,
  },
  description: {
    fontFamily: type.base,
    fontSize: size.medium,
  },
  tileText: {
    fontFamily: type.base,
    fontSize: size.regular,
    color: Colors.swireRed,
    textAlign: 'center',
  },
  titleText: {
    fontFamily: type.base,
    fontSize: size.h4,
    color: Colors.swireRed,
  },
  titleBoldText: {
    fontFamily: type.bold,
    fontSize: size.h4,
    color: Colors.swireRed,
    fontWeight: weight.bold,
  },
  boldText: {
    fontFamily: type.base,
    fontSize: size.regular,
    fontWeight: weight.bold,
    color: Colors.swireDarkGray,
  },
  text20: {
    fontFamily: type.base,
    fontSize: 20,
    color: Colors.swireRed,
    textAlign: 'center',
  },
  btnText: {
    fontFamily: type.base,
    fontSize: 18,
    color: Colors.white,
    textAlign: 'center',
  },
  headerText: {
    fontFamily: type.bold,
    color: Colors.swireDarkGray,
    fontSize: 25,
    textAlign: 'center',
    width: '100%',
    fontWeight: 'bold',
  },
};

export default {
  type,
  weight,
  size,
  style,
};
